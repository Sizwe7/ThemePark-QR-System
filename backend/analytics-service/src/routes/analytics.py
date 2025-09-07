from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.analytics import (
    db, VisitorAnalytics, OperationalMetrics, 
    RealTimeStats, AttractionAnalytics, PaymentAnalytics
)
import logging

logger = logging.getLogger(__name__)

analytics_bp = Blueprint('analytics', __name__)

def success_response(data, message="Success"):
    """Helper function to create consistent success responses"""
    return jsonify({
        'success': True,
        'data': data,
        'message': message,
        'timestamp': datetime.utcnow().isoformat()
    })

def error_response(code, message, status_code=400):
    """Helper function to create consistent error responses"""
    return jsonify({
        'success': False,
        'error': {
            'code': code,
            'message': message
        },
        'timestamp': datetime.utcnow().isoformat()
    }), status_code

@analytics_bp.route('/visitor-stats', methods=['GET'])
def get_visitor_stats():
    """
    Get visitor analytics data
    Query parameters:
    - start_date: Start date (YYYY-MM-DD)
    - end_date: End date (YYYY-MM-DD)
    - granularity: hour, day, week, month
    """
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        granularity = request.args.get('granularity', 'day')
        
        # Default to last 7 days if no dates provided
        if not start_date:
            start_date = (date.today() - timedelta(days=7)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse dates
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Query visitor analytics
        query = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date >= start_date_obj,
            VisitorAnalytics.visit_date <= end_date_obj
        )
        
        visitor_data = query.all()
        
        # Calculate aggregated statistics
        total_visitors = len(visitor_data)
        total_spending = sum(float(v.total_spending or 0) for v in visitor_data)
        avg_duration = sum(v.total_duration_minutes or 0 for v in visitor_data) / max(total_visitors, 1)
        avg_satisfaction = sum(v.satisfaction_rating or 0 for v in visitor_data if v.satisfaction_rating) / max(
            len([v for v in visitor_data if v.satisfaction_rating]), 1
        )
        
        # Group by granularity
        grouped_data = {}
        for visitor in visitor_data:
            if granularity == 'hour' and visitor.entry_time:
                key = visitor.entry_time.strftime('%Y-%m-%d %H:00')
            elif granularity == 'day':
                key = visitor.visit_date.isoformat()
            elif granularity == 'week':
                week_start = visitor.visit_date - timedelta(days=visitor.visit_date.weekday())
                key = week_start.isoformat()
            elif granularity == 'month':
                key = visitor.visit_date.strftime('%Y-%m')
            else:
                key = visitor.visit_date.isoformat()
            
            if key not in grouped_data:
                grouped_data[key] = {
                    'visitors': 0,
                    'spending': 0,
                    'duration': 0,
                    'satisfaction': []
                }
            
            grouped_data[key]['visitors'] += 1
            grouped_data[key]['spending'] += float(visitor.total_spending or 0)
            grouped_data[key]['duration'] += visitor.total_duration_minutes or 0
            if visitor.satisfaction_rating:
                grouped_data[key]['satisfaction'].append(visitor.satisfaction_rating)
        
        # Format grouped data
        time_series = []
        for key, data in sorted(grouped_data.items()):
            avg_satisfaction_period = sum(data['satisfaction']) / max(len(data['satisfaction']), 1)
            time_series.append({
                'period': key,
                'visitors': data['visitors'],
                'total_spending': data['spending'],
                'avg_duration': data['duration'] / max(data['visitors'], 1),
                'avg_satisfaction': avg_satisfaction_period
            })
        
        result = {
            'summary': {
                'total_visitors': total_visitors,
                'total_revenue': total_spending,
                'average_visit_duration': avg_duration,
                'average_spending_per_visitor': total_spending / max(total_visitors, 1),
                'average_satisfaction': avg_satisfaction,
                'period': f"{start_date} to {end_date}"
            },
            'time_series': time_series,
            'granularity': granularity
        }
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error getting visitor stats: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve visitor statistics', 500)

@analytics_bp.route('/real-time', methods=['GET'])
def get_real_time_stats():
    """Get current real-time statistics"""
    try:
        # Get the latest real-time stats
        latest_stats = RealTimeStats.query.order_by(RealTimeStats.timestamp.desc()).first()
        
        if not latest_stats:
            # Return default values if no data exists
            default_stats = {
                'current_visitors': 0,
                'active_queues': 0,
                'average_queue_time': 0,
                'system_load_percentage': 0.0,
                'payment_success_rate': 100.0,
                'api_response_time_ms': 0,
                'cache_hit_rate': 0.0,
                'concurrent_users': 0,
                'last_updated': datetime.utcnow().isoformat()
            }
            return success_response(default_stats)
        
        stats_data = latest_stats.to_dict()
        stats_data['last_updated'] = stats_data['timestamp']
        del stats_data['timestamp']
        del stats_data['id']
        
        return success_response(stats_data)
        
    except Exception as e:
        logger.error(f"Error getting real-time stats: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve real-time statistics', 500)

@analytics_bp.route('/attractions', methods=['GET'])
def get_attraction_analytics():
    """
    Get attraction-specific analytics
    Query parameters:
    - attraction_id: Specific attraction ID (optional)
    - start_date: Start date (YYYY-MM-DD)
    - end_date: End date (YYYY-MM-DD)
    """
    try:
        attraction_id = request.args.get('attraction_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Default to last 7 days if no dates provided
        if not start_date:
            start_date = (date.today() - timedelta(days=7)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse dates
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Build query
        query = AttractionAnalytics.query.filter(
            AttractionAnalytics.date >= start_date_obj,
            AttractionAnalytics.date <= end_date_obj
        )
        
        if attraction_id:
            query = query.filter(AttractionAnalytics.attraction_id == attraction_id)
        
        attraction_data = query.all()
        
        # Group by attraction
        attractions = {}
        for data in attraction_data:
            aid = data.attraction_id
            if aid not in attractions:
                attractions[aid] = {
                    'attraction_id': aid,
                    'attraction_name': data.attraction_name,
                    'total_visitors': 0,
                    'average_wait_time': 0,
                    'max_wait_time': 0,
                    'average_capacity_utilization': 0,
                    'average_satisfaction': 0,
                    'total_downtime_minutes': 0,
                    'total_revenue': 0,
                    'daily_data': []
                }
            
            attractions[aid]['total_visitors'] += data.total_visitors
            attractions[aid]['max_wait_time'] = max(attractions[aid]['max_wait_time'], data.max_wait_time)
            attractions[aid]['total_downtime_minutes'] += data.downtime_minutes
            attractions[aid]['total_revenue'] += float(data.revenue_generated or 0)
            attractions[aid]['daily_data'].append(data.to_dict())
        
        # Calculate averages
        for attraction in attractions.values():
            data_points = len(attraction['daily_data'])
            if data_points > 0:
                attraction['average_wait_time'] = sum(d['average_wait_time'] for d in attraction['daily_data']) / data_points
                attraction['average_capacity_utilization'] = sum(d['capacity_utilization'] for d in attraction['daily_data']) / data_points
                attraction['average_satisfaction'] = sum(d['satisfaction_rating'] for d in attraction['daily_data']) / data_points
        
        result = list(attractions.values())
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error getting attraction analytics: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve attraction analytics', 500)

@analytics_bp.route('/payments', methods=['GET'])
def get_payment_analytics():
    """
    Get payment analytics data
    Query parameters:
    - start_date: Start date (YYYY-MM-DD)
    - end_date: End date (YYYY-MM-DD)
    - payment_method: Filter by payment method (optional)
    """
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        payment_method = request.args.get('payment_method')
        
        # Default to last 7 days if no dates provided
        if not start_date:
            start_date = (date.today() - timedelta(days=7)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse dates
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Build query
        query = PaymentAnalytics.query.filter(
            PaymentAnalytics.date >= start_date_obj,
            PaymentAnalytics.date <= end_date_obj
        )
        
        if payment_method:
            query = query.filter(PaymentAnalytics.payment_method == payment_method)
        
        payment_data = query.all()
        
        # Calculate summary statistics
        total_transactions = sum(p.transaction_count for p in payment_data)
        total_amount = sum(float(p.total_amount or 0) for p in payment_data)
        avg_success_rate = sum(float(p.success_rate or 0) for p in payment_data) / max(len(payment_data), 1)
        avg_processing_time = sum(p.average_processing_time_ms for p in payment_data) / max(len(payment_data), 1)
        
        # Group by payment method
        by_method = {}
        for payment in payment_data:
            method = payment.payment_method
            if method not in by_method:
                by_method[method] = {
                    'payment_method': method,
                    'transaction_count': 0,
                    'total_amount': 0,
                    'success_rate': 0,
                    'avg_processing_time': 0
                }
            
            by_method[method]['transaction_count'] += payment.transaction_count
            by_method[method]['total_amount'] += float(payment.total_amount or 0)
        
        # Calculate method averages
        for method_data in by_method.values():
            method_payments = [p for p in payment_data if p.payment_method == method_data['payment_method']]
            if method_payments:
                method_data['success_rate'] = sum(float(p.success_rate or 0) for p in method_payments) / len(method_payments)
                method_data['avg_processing_time'] = sum(p.average_processing_time_ms for p in method_payments) / len(method_payments)
        
        result = {
            'summary': {
                'total_transactions': total_transactions,
                'total_amount': total_amount,
                'average_transaction_amount': total_amount / max(total_transactions, 1),
                'average_success_rate': avg_success_rate,
                'average_processing_time_ms': avg_processing_time,
                'period': f"{start_date} to {end_date}"
            },
            'by_payment_method': list(by_method.values()),
            'daily_data': [p.to_dict() for p in payment_data]
        }
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error getting payment analytics: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve payment analytics', 500)

@analytics_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """Submit visitor feedback"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('INVALID_DATA', 'No data provided')
        
        # Validate required fields
        rating = data.get('rating')
        if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
            return error_response('INVALID_RATING', 'Rating must be an integer between 1 and 5')
        
        # Create visitor analytics entry for feedback
        feedback_entry = VisitorAnalytics(
            user_id=data.get('user_id'),
            session_id=data.get('session_id'),
            visit_date=date.today(),
            satisfaction_rating=rating,
            feedback_comments=data.get('comments', ''),
            device_type=data.get('device_type'),
            app_version=data.get('app_version')
        )
        
        db.session.add(feedback_entry)
        db.session.commit()
        
        return success_response({
            'feedback_id': feedback_entry.id,
            'message': 'Feedback submitted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error submitting feedback: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to submit feedback', 500)

@analytics_bp.route('/operational-metrics', methods=['GET'])
def get_operational_metrics():
    """Get operational metrics data"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Default to last 7 days if no dates provided
        if not start_date:
            start_date = (date.today() - timedelta(days=7)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse dates
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Query operational metrics
        metrics = OperationalMetrics.query.filter(
            OperationalMetrics.metric_date >= start_date_obj,
            OperationalMetrics.metric_date <= end_date_obj
        ).order_by(OperationalMetrics.metric_date, OperationalMetrics.metric_hour).all()
        
        # Calculate summary statistics
        total_visitors = sum(m.total_visitors for m in metrics)
        total_revenue = sum(float(m.total_revenue or 0) for m in metrics)
        avg_wait_time = sum(m.average_wait_time for m in metrics) / max(len(metrics), 1)
        avg_capacity = sum(float(m.peak_capacity_percentage or 0) for m in metrics) / max(len(metrics), 1)
        avg_satisfaction = sum(float(m.customer_satisfaction_avg or 0) for m in metrics) / max(len(metrics), 1)
        avg_uptime = sum(float(m.system_uptime_percentage or 0) for m in metrics) / max(len(metrics), 1)
        
        result = {
            'summary': {
                'total_visitors': total_visitors,
                'total_revenue': total_revenue,
                'average_wait_time': avg_wait_time,
                'average_capacity_utilization': avg_capacity,
                'average_satisfaction': avg_satisfaction,
                'average_uptime': avg_uptime,
                'period': f"{start_date} to {end_date}"
            },
            'hourly_data': [m.to_dict() for m in metrics]
        }
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error getting operational metrics: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve operational metrics', 500)

