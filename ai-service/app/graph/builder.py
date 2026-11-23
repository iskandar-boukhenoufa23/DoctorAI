from langgraph.graph import StateGraph, START, END

from app.graph.state import DoctorState
from app.graph.router import route_after_classify, route_after_triage, route_after_selection, route_after_retrieve

from app.graph.nodes.classify import classify
from app.graph.nodes.emergency import emergency
from app.graph.nodes.retrieve import retrieve
from app.graph.nodes.generate import generate
from app.graph.nodes.validate import validate
from app.graph.nodes.analyze_image import analyze_image
from app.graph.nodes.triage import triage
from app.graph.nodes.clarify import clarify
from app.graph.nodes.select_doctor import select_doctor


builder = StateGraph(DoctorState)

builder.add_node("classify", classify)
builder.add_node("emergency", emergency)
builder.add_node("triage", triage)
builder.add_node("clarify", clarify)
builder.add_node("select_doctor", select_doctor)
builder.add_node("retrieve", retrieve)
builder.add_node("analyze_image", analyze_image)
builder.add_node("generate", generate)
builder.add_node("validate", validate)

builder.add_edge(START, "classify")

builder.add_conditional_edges(
    "classify",
    route_after_classify,
    {
        "emergency": "emergency",
        "triage": "triage",
    },
)

builder.add_edge("emergency", END)
builder.add_conditional_edges("triage", route_after_triage, {"end": END, "clarify": "clarify", "select_doctor": "select_doctor"})
builder.add_edge("clarify", END)
builder.add_conditional_edges("select_doctor", route_after_selection, {"end": END, "retrieve": "retrieve"})

builder.add_conditional_edges(
    "retrieve",
    route_after_retrieve,
    {
        "analyze_image": "analyze_image",
        "generate": "generate",
    },
)

builder.add_edge("analyze_image", "generate")
builder.add_edge("generate", "validate")
builder.add_edge("validate", END)

doctor_graph = builder.compile()
