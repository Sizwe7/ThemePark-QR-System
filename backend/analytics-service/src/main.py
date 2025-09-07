import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from src.models.analytics import db
from src.routes.analytics import analytics_bp
from src.routes.dashboard import dashboard_bp
from src.routes.reports import reports_bp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'themepark-analytics-secret-key-2025')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL', 
    f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'analytics.db')}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

# Enable CORS for all routes
CORS(app, origins=['*'], supports_credentials=True)

# Register blueprints
app.register_blueprint(analytics_bp, url_prefix='/api/v1/analytics')
app.register_blueprint(dashboard_bp, url_prefix='/api/v1/dashboard')
app.register_blueprint(reports_bp, url_prefix='/api/v1/reports')

# Initialize database
db.init_app(app)
with app.app_context():
    db.create_all()
    logger.info("Database initialized successfully")

# Health check endpoint
@app.route('/health')
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'Theme Park Analytics Service',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })

# API info endpoint
@app.route('/api/v1/info')
def api_info():
    """API information endpoint"""
    return jsonify({
        'service': 'Theme Park QR System Analytics Service',
        'version': '1.0.0',
        'description': 'Analytics and reporting service for theme park operations',
        'author': 'SC MASEKO 402110470',
        'endpoints': {
            'analytics': '/api/v1/analytics',
            'dashboard': '/api/v1/dashboard',
            'reports': '/api/v1/reports',
            'health': '/health'
        },
        'timestamp': datetime.utcnow().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 'NOT_FOUND',
            'message': 'Resource not found'
        },
        'timestamp': datetime.utcnow().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        'success': False,
        'error': {
            'code': 'INTERNAL_ERROR',
            'message': 'Internal server error'
        },
        'timestamp': datetime.utcnow().isoformat()
    }), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'success': False,
        'error': {
            'code': 'BAD_REQUEST',
            'message': 'Bad request'
        },
        'timestamp': datetime.utcnow().isoformat()
    }), 400

# Static file serving for frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return jsonify({
            'success': False,
            'error': {
                'code': 'CONFIG_ERROR',
                'message': 'Static folder not configured'
            }
        }), 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            # Return API info if no frontend is available
            return api_info()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting Theme Park Analytics Service on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

