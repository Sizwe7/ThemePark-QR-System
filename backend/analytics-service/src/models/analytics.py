from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
import uuid

db = SQLAlchemy()

class VisitorAnalytics(db.Model):
    """
    Visitor Analytics Model
    Stores visitor behavior and experience data
    """
    __tablename__ = 'visitor_analytics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), nullable=True)  # Can be null for anonymous visitors
    session_id = db.Column(db.String(36), nullable=True)
    visit_date = db.Column(db.Date, nullable=False, default=date.today)
    entry_time = db.Column(db.DateTime, nullable=True)
    exit_time = db.Column(db.DateTime, nullable=True)
    total_duration_minutes = db.Column(db.Integer, nullable=True)
    attractions_visited = db.Column(db.Integer, default=0)
    total_spending = db.Column(db.Numeric(10, 2), default=0.00)
    queue_time_minutes = db.Column(db.Integer, default=0)
    satisfaction_rating = db.Column(db.Integer, nullable=True)  # 1-5 scale
    feedback_comments = db.Column(db.Text, nullable=True)
    device_type = db.Column(db.String(50), nullable=True)
    app_version = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'visit_date': self.visit_date.isoformat() if self.visit_date else None,
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'total_duration_minutes': self.total_duration_minutes,
            'attractions_visited': self.attractions_visited,
            'total_spending': float(self.total_spending) if self.total_spending else 0.0,
            'queue_time_minutes': self.queue_time_minutes,
            'satisfaction_rating': self.satisfaction_rating,
            'feedback_comments': self.feedback_comments,
            'device_type': self.device_type,
            'app_version': self.app_version,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class OperationalMetrics(db.Model):
    """
    Operational Metrics Model
    Stores hourly operational data for the theme park
    """
    __tablename__ = 'operational_metrics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    metric_date = db.Column(db.Date, nullable=False)
    metric_hour = db.Column(db.Integer, nullable=False)  # 0-23
    total_visitors = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Numeric(12, 2), default=0.00)
    average_wait_time = db.Column(db.Integer, default=0)
    peak_capacity_percentage = db.Column(db.Numeric(5, 2), default=0.00)
    staff_efficiency_score = db.Column(db.Numeric(5, 2), default=0.00)
    system_uptime_percentage = db.Column(db.Numeric(5, 2), default=100.00)
    error_count = db.Column(db.Integer, default=0)
    customer_satisfaction_avg = db.Column(db.Numeric(3, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('metric_date', 'metric_hour', name='unique_date_hour'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'metric_date': self.metric_date.isoformat() if self.metric_date else None,
            'metric_hour': self.metric_hour,
            'total_visitors': self.total_visitors,
            'total_revenue': float(self.total_revenue) if self.total_revenue else 0.0,
            'average_wait_time': self.average_wait_time,
            'peak_capacity_percentage': float(self.peak_capacity_percentage) if self.peak_capacity_percentage else 0.0,
            'staff_efficiency_score': float(self.staff_efficiency_score) if self.staff_efficiency_score else 0.0,
            'system_uptime_percentage': float(self.system_uptime_percentage) if self.system_uptime_percentage else 100.0,
            'error_count': self.error_count,
            'customer_satisfaction_avg': float(self.customer_satisfaction_avg) if self.customer_satisfaction_avg else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class RealTimeStats(db.Model):
    """
    Real-time Statistics Model
    Stores current system status and real-time metrics
    """
    __tablename__ = 'real_time_stats'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    current_visitors = db.Column(db.Integer, default=0)
    active_queues = db.Column(db.Integer, default=0)
    average_queue_time = db.Column(db.Integer, default=0)
    system_load_percentage = db.Column(db.Numeric(5, 2), default=0.00)
    payment_success_rate = db.Column(db.Numeric(5, 2), default=100.00)
    api_response_time_ms = db.Column(db.Integer, default=0)
    cache_hit_rate = db.Column(db.Numeric(5, 2), default=0.00)
    concurrent_users = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'current_visitors': self.current_visitors,
            'active_queues': self.active_queues,
            'average_queue_time': self.average_queue_time,
            'system_load_percentage': float(self.system_load_percentage) if self.system_load_percentage else 0.0,
            'payment_success_rate': float(self.payment_success_rate) if self.payment_success_rate else 100.0,
            'api_response_time_ms': self.api_response_time_ms,
            'cache_hit_rate': float(self.cache_hit_rate) if self.cache_hit_rate else 0.0,
            'concurrent_users': self.concurrent_users
        }

class AttractionAnalytics(db.Model):
    """
    Attraction Analytics Model
    Stores analytics data for individual attractions
    """
    __tablename__ = 'attraction_analytics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    attraction_id = db.Column(db.String(36), nullable=False)
    attraction_name = db.Column(db.String(200), nullable=False)
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Integer, nullable=False)  # 0-23
    total_visitors = db.Column(db.Integer, default=0)
    average_wait_time = db.Column(db.Integer, default=0)
    max_wait_time = db.Column(db.Integer, default=0)
    capacity_utilization = db.Column(db.Numeric(5, 2), default=0.00)
    satisfaction_rating = db.Column(db.Numeric(3, 2), default=0.00)
    downtime_minutes = db.Column(db.Integer, default=0)
    revenue_generated = db.Column(db.Numeric(10, 2), default=0.00)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('attraction_id', 'date', 'hour', name='unique_attraction_date_hour'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'attraction_id': self.attraction_id,
            'attraction_name': self.attraction_name,
            'date': self.date.isoformat() if self.date else None,
            'hour': self.hour,
            'total_visitors': self.total_visitors,
            'average_wait_time': self.average_wait_time,
            'max_wait_time': self.max_wait_time,
            'capacity_utilization': float(self.capacity_utilization) if self.capacity_utilization else 0.0,
            'satisfaction_rating': float(self.satisfaction_rating) if self.satisfaction_rating else 0.0,
            'downtime_minutes': self.downtime_minutes,
            'revenue_generated': float(self.revenue_generated) if self.revenue_generated else 0.0,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PaymentAnalytics(db.Model):
    """
    Payment Analytics Model
    Stores payment-related analytics and trends
    """
    __tablename__ = 'payment_analytics'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    date = db.Column(db.Date, nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # CREDIT_CARD, MOBILE_WALLET, etc.
    transaction_count = db.Column(db.Integer, default=0)
    total_amount = db.Column(db.Numeric(12, 2), default=0.00)
    average_transaction_amount = db.Column(db.Numeric(10, 2), default=0.00)
    success_rate = db.Column(db.Numeric(5, 2), default=100.00)
    average_processing_time_ms = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('date', 'hour', 'payment_method', name='unique_payment_date_hour_method'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'hour': self.hour,
            'payment_method': self.payment_method,
            'transaction_count': self.transaction_count,
            'total_amount': float(self.total_amount) if self.total_amount else 0.0,
            'average_transaction_amount': float(self.average_transaction_amount) if self.average_transaction_amount else 0.0,
            'success_rate': float(self.success_rate) if self.success_rate else 100.0,
            'average_processing_time_ms': self.average_processing_time_ms,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

