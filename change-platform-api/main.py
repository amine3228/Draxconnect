from flask import Flask, request, jsonify, render_template
from models import db, User, Change
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db.init_app(app)
CORS(app)

# créer DB
with app.app_context():
    db.create_all()

# route page
@app.route('/')
def home():
    return render_template("index.html")

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    return jsonify({"success": user is not None})

# ADD CHANGE
@app.route('/addChange', methods=['POST'])
def add_change():
    data = request.json
    new_change = Change(titre=data['titre'], description=data['description'])
    db.session.add(new_change)
    db.session.commit()
    return jsonify({"success": True})

# GET CHANGES
@app.route('/getChanges')
def get_changes():
    changes = Change.query.all()
    return jsonify([{
        "titre": c.titre,
        "description": c.description,
        "statut": c.statut
    } for c in changes])

if __name__ == '__main__':
    app.run(debug=True)