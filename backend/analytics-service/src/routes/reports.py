from flask import Blueprint, request, jsonify, send_file
from datetime import datetime, date, timedelta
from src.models.analytics import (
    db, VisitorAnalytics, OperationalMetrics, 
    RealTimeStats, AttractionAnalytics, PaymentAnalytics
)
import logging
import io
import csv
from collections import defaultdict

logger = logging.getLogger(__name__)

reports_bp = Blueprint('reports', __name__)

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

@reports_bp.route('/daily-summary', methods=['GET'])
def get_daily_summary():
    """Generate daily summary report"""
    try:
        report_date = request.args.get('date')
        
        if not report_date:
            report_date = date.today().isoformat()
        
        # Parse date
        report_date_obj = datetime.strptime(report_date, '%Y-%m-%d').date()
        
        # Get visitor data for the day
        visitors = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date == report_date_obj
        ).all()
        
        # Get operational metrics for the day
        metrics = OperationalMetrics.query.filter(
            OperationalMetrics.metric_date == report_date_obj
        ).all()
        
        # Get attraction data for the day
        attractions = AttractionAnalytics.query.filter(
            AttractionAnalytics.date == report_date_obj
        ).all()
        
        # Get payment data for the day
        payments = PaymentAnalytics.query.filter(
            PaymentAnalytics.date == report_date_obj
        ).all()
        
        # Calculate visitor statistics
        total_visitors = len(visitors)
        total_visitor_spending = sum(float(v.total_spending or 0) for v in visitors)
        avg_visit_duration = sum(v.total_duration_minutes or 0 for v in visitors) / max(total_visitors, 1)
        avg_attractions_visited = sum(v.attractions_visited or 0 for v in visitors) / max(total_visitors, 1)
        
        # Satisfaction statistics
        satisfaction_ratings = [v.satisfaction_rating for v in visitors if v.satisfaction_rating]
        avg_satisfaction = sum(satisfaction_ratings) / max(len(satisfaction_ratings), 1)
        satisfaction_distribution = defaultdict(int)
        for rating in satisfaction_ratings:
            satisfaction_distribution[rating] += 1
        
        # Operational statistics
        total_operational_revenue = sum(float(m.total_revenue or 0) for m in metrics)
        avg_wait_time = sum(m.average_wait_time for m in metrics) / max(len(metrics), 1)
        peak_capacity = max((float(m.peak_capacity_percentage or 0) for m in metrics), default=0)
        avg_system_uptime = sum(float(m.system_uptime_percentage or 0) for m in metrics) / max(len(metrics), 1)
        total_errors = sum(m.error_count for m in metrics)
        
        # Attraction statistics
        attraction_stats = {}
        for attraction in attractions:
            aid = attraction.attraction_id
            if aid not in attraction_stats:
                attraction_stats[aid] = {
                    'name': attraction.attraction_name,
                    'total_visitors': 0,
                    'avg_wait_time': 0,
                    'max_wait_time': 0,
                    'revenue': 0,
                    'downtime': 0
                }
            
            attraction_stats[aid]['total_visitors'] += attraction.total_visitors
            attraction_stats[aid]['max_wait_time'] = max(
                attraction_stats[aid]['max_wait_time'], 
                attraction.max_wait_time
            )
            attraction_stats[aid]['revenue'] += float(attraction.revenue_generated or 0)
            attraction_stats[aid]['downtime'] += attraction.downtime_minutes
        
        # Calculate average wait times for attractions
        for aid, stats in attraction_stats.items():
            attraction_hours = [a for a in attractions if a.attraction_id == aid]
            if attraction_hours:
                stats['avg_wait_time'] = sum(a.average_wait_time for a in attraction_hours) / len(attraction_hours)
        
        # Payment statistics
        payment_stats = {}
        total_transactions = 0
        total_payment_amount = 0
        
        for payment in payments:
            method = payment.payment_method
            if method not in payment_stats:
                payment_stats[method] = {
                    'transaction_count': 0,
                    'total_amount': 0,
                    'success_rate': 0,
                    'avg_processing_time': 0
                }
            
            payment_stats[method]['transaction_count'] += payment.transaction_count
            payment_stats[method]['total_amount'] += float(payment.total_amount or 0)
            total_transactions += payment.transaction_count
            total_payment_amount += float(payment.total_amount or 0)
        
        # Calculate payment method averages
        for method, stats in payment_stats.items():
            method_payments = [p for p in payments if p.payment_method == method]
            if method_payments:
                stats['success_rate'] = sum(float(p.success_rate or 0) for p in method_payments) / len(method_payments)
                stats['avg_processing_time'] = sum(p.average_processing_time_ms for p in method_payments) / len(method_payments)
        
        # Hourly breakdown
        hourly_breakdown = []
        for hour in range(24):
            hour_visitors = [v for v in visitors if v.entry_time and v.entry_time.hour == hour]
            hour_metrics = [m for m in metrics if m.metric_hour == hour]
            
            hourly_breakdown.append({
                'hour': hour,
                'visitors': len(hour_visitors),
                'revenue': sum(float(m.total_revenue or 0) for m in hour_metrics),
                'avg_wait_time': sum(m.average_wait_time for m in hour_metrics) / max(len(hour_metrics), 1),
                'capacity_utilization': sum(float(m.peak_capacity_percentage or 0) for m in hour_metrics) / max(len(hour_metrics), 1)
            })
        
        # Peak hours analysis
        peak_visitor_hour = max(hourly_breakdown, key=lambda x: x['visitors'])
        peak_revenue_hour = max(hourly_breakdown, key=lambda x: x['revenue'])
        
        result = {
            'report_date': report_date,
            'summary': {
                'total_visitors': total_visitors,
                'total_revenue': max(total_visitor_spending, total_operational_revenue, total_payment_amount),
                'average_visit_duration_minutes': round(avg_visit_duration, 1),
                'average_attractions_visited': round(avg_attractions_visited, 1),
                'average_satisfaction_rating': round(avg_satisfaction, 2),
                'average_wait_time_minutes': round(avg_wait_time, 1),
                'peak_capacity_percentage': round(peak_capacity, 1),
                'system_uptime_percentage': round(avg_system_uptime, 1),
                'total_system_errors': total_errors
            },
            'visitor_analytics': {
                'total_count': total_visitors,
                'total_spending': total_visitor_spending,
                'satisfaction_distribution': dict(satisfaction_distribution),
                'average_satisfaction': round(avg_satisfaction, 2)
            },
            'attraction_performance': list(attraction_stats.values()),
            'payment_analytics': {
                'total_transactions': total_transactions,
                'total_amount': total_payment_amount,
                'by_method': payment_stats
            },
            'peak_hours': {
                'highest_visitors': {
                    'hour': peak_visitor_hour['hour'],
                    'count': peak_visitor_hour['visitors']
                },
                'highest_revenue': {
                    'hour': peak_revenue_hour['hour'],
                    'amount': peak_revenue_hour['revenue']
                }
            },
            'hourly_breakdown': hourly_breakdown
        }
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error generating daily summary: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to generate daily summary', 500)

@reports_bp.route('/weekly-summary', methods=['GET'])
def get_weekly_summary():
    """Generate weekly summary report"""
    try:
        end_date = request.args.get('end_date')
        
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse end date and calculate start date
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        start_date_obj = end_date_obj - timedelta(days=6)  # 7 days total
        
        # Get data for the week
        visitors = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date >= start_date_obj,
            VisitorAnalytics.visit_date <= end_date_obj
        ).all()
        
        metrics = OperationalMetrics.query.filter(
            OperationalMetrics.metric_date >= start_date_obj,
            OperationalMetrics.metric_date <= end_date_obj
        ).all()
        
        # Group by day
        daily_stats = {}
        for day in range(7):
            current_date = start_date_obj + timedelta(days=day)
            day_visitors = [v for v in visitors if v.visit_date == current_date]
            day_metrics = [m for m in metrics if m.metric_date == current_date]
            
            daily_stats[current_date.isoformat()] = {
                'date': current_date.isoformat(),
                'day_of_week': current_date.strftime('%A'),
                'visitors': len(day_visitors),
                'revenue': sum(float(m.total_revenue or 0) for m in day_metrics),
                'avg_satisfaction': 0,
                'avg_wait_time': sum(m.average_wait_time for m in day_metrics) / max(len(day_metrics), 1)
            }
            
            # Calculate satisfaction for the day
            day_satisfaction = [v.satisfaction_rating for v in day_visitors if v.satisfaction_rating]
            if day_satisfaction:
                daily_stats[current_date.isoformat()]['avg_satisfaction'] = sum(day_satisfaction) / len(day_satisfaction)
        
        # Calculate week totals and averages
        total_visitors_week = len(visitors)
        total_revenue_week = sum(float(m.total_revenue or 0) for m in metrics)
        avg_satisfaction_week = 0
        
        all_satisfaction = [v.satisfaction_rating for v in visitors if v.satisfaction_rating]
        if all_satisfaction:
            avg_satisfaction_week = sum(all_satisfaction) / len(all_satisfaction)
        
        avg_wait_time_week = sum(m.average_wait_time for m in metrics) / max(len(metrics), 1)
        
        # Find best and worst days
        daily_list = list(daily_stats.values())
        best_day_visitors = max(daily_list, key=lambda x: x['visitors'])
        worst_day_visitors = min(daily_list, key=lambda x: x['visitors'])
        best_day_revenue = max(daily_list, key=lambda x: x['revenue'])
        
        # Calculate trends (compare with previous week)
        prev_week_start = start_date_obj - timedelta(days=7)
        prev_week_end = start_date_obj - timedelta(days=1)
        
        prev_visitors = VisitorAnalytics.query.filter(
            VisitorAnalytics.visit_date >= prev_week_start,
            VisitorAnalytics.visit_date <= prev_week_end
        ).count()
        
        prev_metrics = OperationalMetrics.query.filter(
            OperationalMetrics.metric_date >= prev_week_start,
            OperationalMetrics.metric_date <= prev_week_end
        ).all()
        
        prev_revenue = sum(float(m.total_revenue or 0) for m in prev_metrics)
        
        # Calculate growth
        visitor_growth = 0
        revenue_growth = 0
        if prev_visitors > 0:
            visitor_growth = ((total_visitors_week - prev_visitors) / prev_visitors) * 100
        if prev_revenue > 0:
            revenue_growth = ((total_revenue_week - prev_revenue) / prev_revenue) * 100
        
        result = {
            'period': f"{start_date_obj.isoformat()} to {end_date_obj.isoformat()}",
            'summary': {
                'total_visitors': total_visitors_week,
                'total_revenue': total_revenue_week,
                'average_daily_visitors': total_visitors_week / 7,
                'average_daily_revenue': total_revenue_week / 7,
                'average_satisfaction': round(avg_satisfaction_week, 2),
                'average_wait_time': round(avg_wait_time_week, 1),
                'visitor_growth_percentage': round(visitor_growth, 1),
                'revenue_growth_percentage': round(revenue_growth, 1)
            },
            'daily_breakdown': daily_list,
            'highlights': {
                'best_day_visitors': {
                    'date': best_day_visitors['date'],
                    'day': best_day_visitors['day_of_week'],
                    'count': best_day_visitors['visitors']
                },
                'worst_day_visitors': {
                    'date': worst_day_visitors['date'],
                    'day': worst_day_visitors['day_of_week'],
                    'count': worst_day_visitors['visitors']
                },
                'best_day_revenue': {
                    'date': best_day_revenue['date'],
                    'day': best_day_revenue['day_of_week'],
                    'amount': best_day_revenue['revenue']
                }
            }
        }
        
        return success_response(result)
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error generating weekly summary: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to generate weekly summary', 500)

@reports_bp.route('/export/csv', methods=['GET'])
def export_csv_report():
    """Export analytics data as CSV"""
    try:
        report_type = request.args.get('type', 'visitors')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Default to last 30 days if no dates provided
        if not start_date:
            start_date = (date.today() - timedelta(days=30)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # Parse dates
        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Create CSV content based on report type
        output = io.StringIO()
        writer = csv.writer(output)
        
        if report_type == 'visitors':
            # Visitor analytics CSV
            visitors = VisitorAnalytics.query.filter(
                VisitorAnalytics.visit_date >= start_date_obj,
                VisitorAnalytics.visit_date <= end_date_obj
            ).all()
            
            # Write header
            writer.writerow([
                'Date', 'User ID', 'Entry Time', 'Exit Time', 'Duration (minutes)',
                'Attractions Visited', 'Total Spending', 'Satisfaction Rating',
                'Feedback Comments', 'Device Type'
            ])
            
            # Write data
            for visitor in visitors:
                writer.writerow([
                    visitor.visit_date.isoformat() if visitor.visit_date else '',
                    visitor.user_id or '',
                    visitor.entry_time.isoformat() if visitor.entry_time else '',
                    visitor.exit_time.isoformat() if visitor.exit_time else '',
                    visitor.total_duration_minutes or 0,
                    visitor.attractions_visited or 0,
                    float(visitor.total_spending or 0),
                    visitor.satisfaction_rating or '',
                    visitor.feedback_comments or '',
                    visitor.device_type or ''
                ])
            
            filename = f'visitor_analytics_{start_date}_to_{end_date}.csv'
            
        elif report_type == 'operational':
            # Operational metrics CSV
            metrics = OperationalMetrics.query.filter(
                OperationalMetrics.metric_date >= start_date_obj,
                OperationalMetrics.metric_date <= end_date_obj
            ).order_by(OperationalMetrics.metric_date, OperationalMetrics.metric_hour).all()
            
            # Write header
            writer.writerow([
                'Date', 'Hour', 'Total Visitors', 'Total Revenue', 'Average Wait Time',
                'Peak Capacity %', 'Staff Efficiency', 'System Uptime %', 'Error Count',
                'Customer Satisfaction Avg'
            ])
            
            # Write data
            for metric in metrics:
                writer.writerow([
                    metric.metric_date.isoformat() if metric.metric_date else '',
                    metric.metric_hour,
                    metric.total_visitors,
                    float(metric.total_revenue or 0),
                    metric.average_wait_time,
                    float(metric.peak_capacity_percentage or 0),
                    float(metric.staff_efficiency_score or 0),
                    float(metric.system_uptime_percentage or 0),
                    metric.error_count,
                    float(metric.customer_satisfaction_avg or 0)
                ])
            
            filename = f'operational_metrics_{start_date}_to_{end_date}.csv'
            
        elif report_type == 'attractions':
            # Attraction analytics CSV
            attractions = AttractionAnalytics.query.filter(
                AttractionAnalytics.date >= start_date_obj,
                AttractionAnalytics.date <= end_date_obj
            ).order_by(AttractionAnalytics.date, AttractionAnalytics.hour).all()
            
            # Write header
            writer.writerow([
                'Date', 'Hour', 'Attraction ID', 'Attraction Name', 'Total Visitors',
                'Average Wait Time', 'Max Wait Time', 'Capacity Utilization %',
                'Satisfaction Rating', 'Downtime (minutes)', 'Revenue Generated'
            ])
            
            # Write data
            for attraction in attractions:
                writer.writerow([
                    attraction.date.isoformat() if attraction.date else '',
                    attraction.hour,
                    attraction.attraction_id,
                    attraction.attraction_name,
                    attraction.total_visitors,
                    attraction.average_wait_time,
                    attraction.max_wait_time,
                    float(attraction.capacity_utilization or 0),
                    float(attraction.satisfaction_rating or 0),
                    attraction.downtime_minutes,
                    float(attraction.revenue_generated or 0)
                ])
            
            filename = f'attraction_analytics_{start_date}_to_{end_date}.csv'
            
        else:
            return error_response('INVALID_TYPE', 'Invalid report type. Use: visitors, operational, or attractions')
        
        # Prepare file for download
        output.seek(0)
        csv_data = output.getvalue()
        output.close()
        
        # Create file-like object for sending
        csv_file = io.BytesIO(csv_data.encode('utf-8'))
        csv_file.seek(0)
        
        return send_file(
            csv_file,
            mimetype='text/csv',
            as_attachment=True,
            download_name=filename
        )
        
    except ValueError as e:
        return error_response('INVALID_DATE', f'Invalid date format: {str(e)}')
    except Exception as e:
        logger.error(f"Error exporting CSV: {str(e)}")
        return error_response('INTERNAL_ERROR', 'Failed to export CSV report', 500)

