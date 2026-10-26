from langchain_core.prompts import ChatPromptTemplate
from app.safety.policy import SYSTEM_POLICY
ANSWER_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_POLICY + "\nEvidence excerpts:\n{context}"),
    ("human", "{question}")
])
