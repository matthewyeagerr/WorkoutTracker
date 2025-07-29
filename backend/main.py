from flask import request, jsonify
from config import app, db
from models import Contact

@app.route("/contacts", methods=['GET']) # decorator to define a route. create new route, what route (/contacts), valid methods. use GET method for this url
def get_contacts():
    contacts = Contact.query.all() # uses flask sqlalchemy to get all contacts from the database
    json_contacts = list(map(lambda x: x.to_json(), contacts)) # convert each contact to JSON, cant return python object directly, must convert to JSON. contacts is list of Contact objects, map applies to each object in the list
    return jsonify({"contacts": json_contacts}) # return a json object 


@app.route("/create_contact", methods=['POST']) #creating, so post 
def create_contact():
    first_name = request.json.get('firstName') # get data from request body, json format
    last_name = request.json.get('lastName') # look in json data, use .get, if it doesnt exist, it will return None, otherwise it will return the value
    email = request.json.get('email')
    
    if not first_name or not last_name or not email: # check if any of the fields are empty
        return jsonify({"message": "Missing data"}), 400
    
    
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact) # add new contact to the database session
        db.session.commit() # commit the session to save changes to the database
    except Exception as e:
        return jsonify({"message": "Error adding contact", "error": str(e)}), 400
    
    return jsonify({"message": "Contact added successfully"}), 201


@app.route("/update_contact/<int:user_id>", methods = ["PATCH"]) # we needt opass to this route update contact and the number indication the user we want to update
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name) # if data.get returns None, it will keep the old value. use camel for json 
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)
    
    db.session.commit() # commit the session to save changes to the database
    return jsonify({"message": "Contact updated successfully"}), 200

@app.route("/delete_contact/<int:user_id>", methods=['DELETE']) # delete contact, pass user id to delete
def delete_contact(user_id):    
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "Contact not found"}), 404
    db.session.delete(contact)
    db.session.commit() # commit the session to save changes to the database

    return jsonify({"message": "Contact deleted successfully"}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)
    
    