import requests
import json
import time
import uuid

BASE_URL = "http://localhost:8081/api/v1"
SESSION = requests.Session()

def print_separator(title):
    print(f"\n{'='*50}\n{title}\n{'='*50}")

def authenticate():
    print_separator("1. Authentication")
    
    # Try login first
    login_data = {
        "email": "testuser@opspilot.com",
        "password": "password123"
    }
    
    resp = SESSION.post(f"{BASE_URL}/auth/login", json=login_data)
    if resp.status_code == 200:
        token = resp.json()['token']
        print("Logged in successfully.")
    else:
        # Register
        reg_data = {
            "name": "Test User",
            "email": "testuser@opspilot.com",
            "password": "password123",
            "role": "CUSTOMER"
        }
        resp = SESSION.post(f"{BASE_URL}/auth/register", json=reg_data)
        resp.raise_for_status()
        token = resp.json()['token']
        print("Registered and logged in successfully.")
        
        # Link a test order to this user for the tool calling (wait, orders are seeded for customer_id 9999)
        # But wait, our API cancellation check checks if the user owns the order.
        # But the AI chat might just pass the order ID.
        # The AI chat just uses the current user's email.
        # Let's hope order details tool doesn't strictly check user ownership, or if it does, we'll see.
        
    SESSION.headers.update({"Authorization": f"Bearer {token}"})

def chat(message, conv_id):
    print(f"\nUser: {message}")
    resp = SESSION.post(f"{BASE_URL}/ai/chat", json={
        "message": message,
        "conversationId": conv_id
    })
    
    if resp.status_code == 200:
        print(f"AI: {resp.json().get('response')}")
    else:
        print(f"Error {resp.status_code}: {resp.text}")
    
    # Sleep to avoid hitting the Gemini API 15 RPM limit
    print("Sleeping for 15 seconds to avoid rate limiting...")
    time.sleep(15)

def main():
    try:
        authenticate()
        
        conv_id = str(uuid.uuid4())
        
        print_separator("2. Basic AI Chat")
        chat("Hello, who are you?", conv_id)
        
        print_separator("3. RAG: Knowledge Base")
        chat("What is the refund policy?", conv_id)
        
        print_separator("4. Order Tool")
        # Order 1001 belongs to user 9999. If ownership check is there, it might fail, but let's test.
        chat("Get my order details for order 1001", conv_id)
        
        print_separator("5. Ticket Creation")
        chat("Create a ticket for a broken item", conv_id)
        
        print_separator("6. Cancellation (Safeguard check)")
        # Order 1003 is PROCESSING
        chat("Cancel my order 1003", conv_id)
        chat("yes", conv_id) # confirm cancellation
        
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    main()
