from app.graph.builder import doctor_graph

def test_emergency_graph_without_llm():
    result = doctor_graph.invoke({"question":"I have chest pain", "user_id":"u1", "chat_id":"c1"})
    assert result["decision"] == "emergency_escalation"
