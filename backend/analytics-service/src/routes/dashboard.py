from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from src.models.analytics import (
    db, VisitorAnalytics, OperationalMetrics, 
    RealTimeStats, AttractionAnalytics, PaymentAnalytics
)
import logging

logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__)

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

@dashboard_bp.route('/overview', methods=['GET'])
def get_dashboard_overview():
    """Get comprehensive dashboard overview"""
    try:
        today = date.today()
        
        # Get today's visitor analytics
        today_visitors = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date == today
        ).all()
        
        # Get today's operational metrics
        today_metrics = OperationalMetrics.query.filter(
            OperationalMetrics.metric_date == today
        ).all()
        
        # Get latest real-time stats
        latest_stats = RealTimeStats.query.order_by(
            RealTimeStats.timestamp.desc()
        ).first()
        
        # Calculate today's summary
        total_visitors_today = len(today_visitors)
        total_spending_today = sum(float(v.total_spending or 0) for v in today_visitors)
        avg_satisfaction_today = 0
        if today_visitors:
            satisfaction_ratings = [v.satisfaction_rating for v in today_visitors if v.satisfaction_rating]
            if satisfaction_ratings:
                avg_satisfaction_today = sum(satisfaction_ratings) / len(satisfaction_ratings)
        
        # Calculate revenue from operational metrics
        total_revenue_today = sum(float(m.total_revenue or 0) for m in today_metrics)
        avg_wait_time_today = sum(m.average_wait_time for m in today_metrics) / max(len(today_metrics), 1)
        
        # Get week comparison
        week_ago = today - timedelta(days=7)
        week_visitors = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date >= week_ago,
            VisitorAnalytics.visit_date < today
        ).all()
        
        visitors_last_week = len(week_visitors)
        spending_last_week = sum(float(v.total_spending or 0) for v in week_visitors)
        
        # Calculate growth percentages
        visitor_growth = 0
        revenue_growth = 0
        if visitors_last_week > 0:
            visitor_growth = ((total_visitors_today - (visitors_last_week / 7)) / (visitors_last_week / 7)) * 100
        if spending_last_week > 0:
            revenue_growth = ((total_spending_today - (spending_last_week / 7)) / (spending_last_week / 7)) * 100
        
        # Get hourly data for today
        hourly_data = []
        for hour in range(24):
            hour_visitors = [v for v in today_visitors if v.entry_time and v.entry_time.hour == hour]
            hour_metrics = [m for m in today_metrics if m.metric_hour == hour]
            
            hourly_data.append({
                'hour': hour,
                'visitors': len(hour_visitors),
                'revenue': sum(float(m.total_revenue or 0) for m in hour_metrics),
                'avg_wait_time': sum(m.average_wait_time for m in hour_metrics) / max(len(hour_metrics), 1)
            })
        
        # Real-time stats
        real_time_data = {}
        if latest_stats:
            real_time_data = {
                'current_visitors': latest_stats.current_visitors,
                'active_queues': latest_stats.active_queues,
                'average_queue_time': latest_stats.average_queue_time,
                'system_load': float(latest_stats.system_load_percentage or 0),
                'payment_success_rate': float(latest_stats.payment_success_rate or 100),
                'api_response_time': latest_stats.api_response_time_ms,
                'last_updated': latest_stats.timestamp.isoformat()
            }
        else:
            real_time_data = {
                'current_visitors': 0,
                'active_queues': 0,
                'average_queue_time': 0,
                'system_load': 0,
                'payment_success_rate': 100,
                'api_response_time': 0,
                'last_updated': datetime.utcnow().isoformat()
            }
        
        result = {
            'summary': {
                'total_visitors_today': total_visitors_today,
                'total_revenue_today': max(total_spending_today, total_revenue_today),
                'average_satisfaction_today': round(avg_satisfaction_today, 2),
                'average_wait_time_today': round(avg_wait_time_today, 1),
                'visitor_growth_percentage': round(visitor_growth, 1),
                'revenue_growth_percentage': round(revenue_growth, 1)
            },
            'real_time': real_time_data,
            'hourly_trends': hourly_data,
            'date': today.isoformat()
        }
        
        return success_response(result)
        
    except Exception as e:
        logger.error(f"Error getting dashboard overview: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve dashboard overview', 500)

@dashboard_bp.route('/attractions-status', methods=['GET'])
def get_attractions_status():
    """Get current status of all attractions"""
    try:
        today = date.today()
        current_hour = datetime.now().hour
        
        # Get latest attraction analytics for today
        attraction_data = AttractionAnalytics.query.filter(
            AttractionAnalytics.date == today,
            AttractionAnalytics.hour <= current_hour
        ).all()
        
        # Group by attraction
        attractions = {}
        for data in attraction_data:
            aid = data.attraction_id
            if aid not in attractions:
                attractions[aid] = {
                    'attraction_id': aid,
                    'attraction_name': data.attraction_name,
                    'current_visitors': 0,
                    'current_wait_time': 0,
                    'capacity_utilization': 0,
                    'status': 'OPEN',  # Default status
                    'satisfaction_rating': 0,
                    'total_visitors_today': 0
                }
            
            # Use latest hour data for current status
            if data.hour == current_hour:
                attractions[aid]['current_visitors'] = data.total_visitors
                attractions[aid]['current_wait_time'] = data.average_wait_time
                attractions[aid]['capacity_utilization'] = float(data.capacity_utilization or 0)
                attractions[aid]['satisfaction_rating'] = float(data.satisfaction_rating or 0)
            
            attractions[aid]['total_visitors_today'] += data.total_visitors
        
        # Convert to list and sort by popularity
        attractions_list = list(attractions.values())
        attractions_list.sort(key=lambda x: x['total_visitors_today'], reverse=True)
        
        # Add status based on capacity and wait time
        for attraction in attractions_list:
            if attraction['capacity_utilization'] > 95:
                attraction['status'] = 'FULL_CAPACITY'
            elif attraction['current_wait_time'] > 60:
                attraction['status'] = 'HIGH_DEMAND'
            elif attraction['capacity_utilization'] < 10:
                attraction['status'] = 'LOW_DEMAND'
            else:
                attraction['status'] = 'OPEN'
        
        return success_response(attractions_list)
        
    except Exception as e:
        logger.error(f"Error getting attractions status: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve attractions status', 500)

@dashboard_bp.route('/payment-trends', methods=['GET'])
def get_payment_trends():
    """Get payment trends and statistics"""
    try:
        today = date.today()
        week_ago = today - timedelta(days=7)
        
        # Get payment analytics for the last week
        payment_data = PaymentAnalytics.query.filter(
            PaymentAnalytics.date >= week_ago,
            PaymentAnalytics.date <= today
        ).all()
        
        # Group by payment method
        by_method = {}
        daily_totals = {}
        
        for payment in payment_data:
            method = payment.payment_method
            day = payment.date.isoformat()
            
            # By method aggregation
            if method not in by_method:
                by_method[method] = {
                    'payment_method': method,
                    'transaction_count': 0,
                    'total_amount': 0,
                    'success_rate': 0,
                    'avg_processing_time': 0,
                    'daily_data': []
                }
            
            by_method[method]['transaction_count'] += payment.transaction_count
            by_method[method]['total_amount'] += float(payment.total_amount or 0)
            by_method[method]['daily_data'].append({
                'date': day,
                'transactions': payment.transaction_count,
                'amount': float(payment.total_amount or 0)
            })
            
            # Daily totals
            if day not in daily_totals:
                daily_totals[day] = {
                    'date': day,
                    'total_transactions': 0,
                    'total_amount': 0,
                    'methods': {}
                }
            
            daily_totals[day]['total_transactions'] += payment.transaction_count
            daily_totals[day]['total_amount'] += float(payment.total_amount or 0)
            daily_totals[day]['methods'][method] = {
                'transactions': payment.transaction_count,
                'amount': float(payment.total_amount or 0)
            }
        
        # Calculate averages for each method
        for method_data in by_method.values():
            method_payments = [p for p in payment_data if p.payment_method == method_data['payment_method']]
            if method_payments:
                method_data['success_rate'] = sum(float(p.success_rate or 0) for p in method_payments) / len(method_payments)
                method_data['avg_processing_time'] = sum(p.average_processing_time_ms for p in method_payments) / len(method_payments)
        
        # Calculate overall statistics
        total_transactions = sum(p.transaction_count for p in payment_data)
        total_amount = sum(float(p.total_amount or 0) for p in payment_data)
        avg_success_rate = sum(float(p.success_rate or 0) for p in payment_data) / max(len(payment_data), 1)
        
        result = {
            'summary': {
                'total_transactions_week': total_transactions,
                'total_amount_week': total_amount,
                'average_transaction_amount': total_amount / max(total_transactions, 1),
                'overall_success_rate': round(avg_success_rate, 2),
                'most_popular_method': max(by_method.values(), key=lambda x: x['transaction_count'])['payment_method'] if by_method else 'N/A'
            },
            'by_payment_method': list(by_method.values()),
            'daily_trends': sorted(daily_totals.values(), key=lambda x: x['date'])
        }
        
        return success_response(result)
        
    except Exception as e:
        logger.error(f"Error getting payment trends: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve payment trends', 500)

@dashboard_bp.route('/system-health', methods=['GET'])
def get_system_health():
    """Get system health and performance metrics"""
    try:
        # Get recent real-time stats (last hour)
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_stats = RealTimeStats.query.filter(
            RealTimeStats.timestamp >= one_hour_ago
        ).order_by(RealTimeStats.timestamp.desc()).all()
        
        if not recent_stats:
            # Return default healthy status if no data
            return success_response({
                'status': 'HEALTHY',
                'system_load': 0,
                'api_response_time': 0,
                'payment_success_rate': 100,
                'cache_hit_rate': 0,
                'uptime_percentage': 100,
                'alerts': [],
                'last_updated': datetime.utcnow().isoformat()
            })
        
        latest_stat = recent_stats[0]
        
        # Calculate averages over the last hour
        avg_system_load = sum(float(s.system_load_percentage or 0) for s in recent_stats) / len(recent_stats)
        avg_response_time = sum(s.api_response_time_ms for s in recent_stats) / len(recent_stats)
        avg_payment_success = sum(float(s.payment_success_rate or 0) for s in recent_stats) / len(recent_stats)
        avg_cache_hit = sum(float(s.cache_hit_rate or 0) for s in recent_stats) / len(recent_stats)
        
        # Determine system status and alerts
        status = 'HEALTHY'
        alerts = []
        
        if avg_system_load > 90:
            status = 'CRITICAL'
            alerts.append({
                'level': 'CRITICAL',
                'message': f'High system load: {avg_system_load:.1f}%',
                'timestamp': datetime.utcnow().isoformat()
            })
        elif avg_system_load > 75:
            status = 'WARNING'
            alerts.append({
                'level': 'WARNING',
                'message': f'Elevated system load: {avg_system_load:.1f}%',
                'timestamp': datetime.utcnow().isoformat()
            })
        
        if avg_response_time > 1000:
            if status != 'CRITICAL':
                status = 'WARNING'
            alerts.append({
                'level': 'WARNING',
                'message': f'Slow API response time: {avg_response_time:.0f}ms',
                'timestamp': datetime.utcnow().isoformat()
            })
        
        if avg_payment_success < 95:
            status = 'CRITICAL'
            alerts.append({
                'level': 'CRITICAL',
                'message': f'Low payment success rate: {avg_payment_success:.1f}%',
                'timestamp': datetime.utcnow().isoformat()
            })
        
        # Calculate uptime (simplified - assume 100% if no critical alerts)
        uptime_percentage = 100.0 if status != 'CRITICAL' else 95.0
        
        result = {
            'status': status,
            'system_load': round(avg_system_load, 1),
            'api_response_time': round(avg_response_time, 0),
            'payment_success_rate': round(avg_payment_success, 1),
            'cache_hit_rate': round(avg_cache_hit, 1),
            'uptime_percentage': uptime_percentage,
            'current_visitors': latest_stat.current_visitors,
            'concurrent_users': latest_stat.concurrent_users,
            'alerts': alerts,
            'last_updated': latest_stat.timestamp.isoformat(),
            'metrics_count': len(recent_stats)
        }
        
        return success_response(result)
        
    except Exception as e:
        logger.error(f"Error getting system health: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to retrieve system health', 500)

@dashboard_bp.route('/update-real-time', methods=['POST'])
def update_real_time_stats():
    """Update real-time statistics (for system monitoring)"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response('INVALID_DATA', 'No data provided')
        
        # Create new real-time stats entry
        stats = RealTimeStats(
            current_visitors=data.get('current_visitors', 0),
            active_queues=data.get('active_queues', 0),
            average_queue_time=data.get('average_queue_time', 0),
            system_load_percentage=data.get('system_load_percentage', 0),
            payment_success_rate=data.get('payment_success_rate', 100),
            api_response_time_ms=data.get('api_response_time_ms', 0),
            cache_hit_rate=data.get('cache_hit_rate', 0),
            concurrent_users=data.get('concurrent_users', 0)
        )
        
        db.session.add(stats)
        db.session.commit()
        
        return success_response({
            'stats_id': stats.id,
            'message': 'Real-time stats updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating real-time stats: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to update real-time stats', 500)

