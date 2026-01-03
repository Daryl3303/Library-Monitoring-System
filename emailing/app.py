from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from configs.email_config import Config
from flask_cors import CORS

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mail.init_app(app)
    CORS(app)

    return app

app = create_app()


@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.json

        recipient = data.get('recipient')
        subject = data.get('subject', 'No Subject')
        html_body = data.get('html')

        if not recipient:
            return jsonify({'error': 'recipient is required'}), 400

        if not html_body:
            return jsonify({'error': 'html email body is required'}), 400

        msg = Message(
            subject=subject,
            recipients=[recipient]
        )

        msg.html = html_body
        msg.body = "This email requires an HTML-compatible email client."

        # Optional: BCC yourself
        msg.bcc = [app.config['MAIL_USERNAME']]

        mail.send(msg)

        return jsonify({'message': 'Email sent successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)