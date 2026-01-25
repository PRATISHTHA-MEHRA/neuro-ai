import streamlit as st
from groq import Groq
from apikey import GROQ_API_KEY
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

# Initialize conversation history and input state in Streamlit session state
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'user_input' not in st.session_state:
    st.session_state.user_input = ""

def generate_response(user_input):
    """Generate a response using Llama 3 and maintain conversation context."""
    # Add the current user input to the conversation history
    st.session_state.conversation_history.append({"role": "user", "content": user_input})

    # Create a completion with the conversation history
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=st.session_state.conversation_history,  # Send the entire conversation history
        temperature=0.7,
        max_tokens=150,
        top_p=0.9,
        stream=True,
        stop=None,
    )

    # Gather the response text
    response_text = ""
    for chunk in completion:
        if hasattr(chunk, 'choices') and len(chunk.choices) > 0:
            response_text += chunk.choices[0].delta.content or ""

    # Add the response to the conversation history
    st.session_state.conversation_history.append({"role": "assistant", "content": response_text})

    return response_text

def generate_analysis_report():
    """Generate a brief report on behavior and learning based on the conversation history."""
    user_responses = [msg['content'] for msg in st.session_state.conversation_history if msg['role'] == 'user']

    prompt = (
        "Based on the following conversation, generate a brief report focusing on the user's behavior and learning. "
        "Identify key themes, concerns, and learning strategies mentioned. Provide a summary of the user's educational needs and any suggestions for improvement.\n\n"
        "Conversation:\n"
    )

    for msg in st.session_state.conversation_history:
        prompt += f"{msg['role'].capitalize()}: {msg['content']}\n"

    try:
        response_text = generate_response(prompt)

        if not response_text.strip():
            raise ValueError("The generated response is empty. Check the API response or prompt.")

        # Create a PDF document
        pdf_filename = "analysis_report.pdf"
        doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        title = "Analysis Report"
        story.append(Paragraph(title, styles['Title']))
        story.append(Spacer(1, 12))

        # Use Preformatted style to preserve new lines
        preformatted_style = ParagraphStyle(name='Preformatted', parent=styles['BodyText'], spaceAfter=12)
        story.append(Preformatted(response_text, preformatted_style))

        doc.build(story)

        # Read the PDF file to return as a byte stream
        with open(pdf_filename, 'rb') as pdf_file:
            pdf_data = pdf_file.read()

        return pdf_data, pdf_filename

    except Exception as e:
        st.write(f"Error generating report: {e}")
        return None, "An error occurred while generating the report."

def main():
    st.markdown("""
        <style>
        body {
            background-color: #fff;
            font-family: Arial, sans-serif;
        }
        .centered-title {
            text-align: center;
            color: #333;
        }

        .chat-bubble {
            padding: 15px;
            border-radius: 20px;
            max-width: 70%;
            margin-bottom: 15px;
            font-size: 1.1rem;
            line-height: 1.4;
        }
        .user-bubble {
            background-color: #2D8CFF;
            text-align: left;
            color: white;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
        }
        .bot-bubble {
            background-color: #f3e5ab;
            text-align: right;
            color: #000;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.15);
        }
        .chat-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .chat-container .bot-bubble {
            align-self: flex-end;
        }

        .stButton>button {
            background-color: #89D85D;
            color: black;
            font-weight: bold;
            border: none;
            padding: 12px 28px;
            text-align: center;
            font-size: 18px;
            margin: 6px 2px;
            cursor: pointer;
            border-radius: 12px;
            transition: all 0.3s ease;
            outline: none;
        }

        .stButton>button:hover {
            background-color: #013220;
            transform: scale(1.05);
            color: white;
        }

        .stButton>button:focus,
        .stButton>button:active {
            background-color: #89D85D;
            color: black;
            outline: none;
            box-shadow: none;
        }

        .stAudio {
            margin-top: 20px;
        }
        </style>
    """, unsafe_allow_html=True)

    st.markdown('<div class="main-chat-area">', unsafe_allow_html=True)  # Open main chat area with white background

    st.markdown('<h1 class="centered-title">🤖Voice Chatbot🗣️</h1>', unsafe_allow_html=True)

    if len(st.session_state.conversation_history) == 0:
        introduction = "Hello! I'm NeuroAi's chatbot. I'm here to help you with your learning journey and make it as enjoyable and effective as possible. How are you feeling today about your studies?"
        st.session_state.conversation_history.append({"role": "assistant", "content": introduction})
        st.write(introduction)

    st.subheader("Conversation")
    chat_html = '<div class="chat-container">'
    for msg in st.session_state.conversation_history:
        if msg['role'] == 'user':
            chat_html += f'<div class="chat-bubble user-bubble">You: {msg["content"]}</div>'
        else:
            chat_html += f'<div class="chat-bubble bot-bubble">Bot: {msg["content"]}</div>'
    chat_html += '</div>'
    st.markdown(chat_html, unsafe_allow_html=True)

    st.subheader("Type your message")
    
    # Use form to handle Enter key and clear input
    with st.form(key="chat_form", clear_on_submit=True):
        user_text = st.text_input("Your message:", key="text_input", placeholder="Type your message here...")
        submit_button = st.form_submit_button("Send", type="primary")
        
        if submit_button and user_text:
            response = generate_response(user_text)
            st.rerun()  # Refresh to show new message

    if st.button("Generate Analysis Report"):
        pdf_data, filename = generate_analysis_report()
        if pdf_data:
            st.download_button("Download Report", data=pdf_data, file_name=filename, mime="application/pdf")

if __name__ == "__main__":
    main()
