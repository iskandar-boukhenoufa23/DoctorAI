from langgraph.graph import StateGraph, START, END

from app.graph.state import DoctorState
from app.graph.router import route_after_classify

from app.graph.nodes.classify import classify
from app.graph.nodes.emergency import emergency
from app.graph.nodes.retrieve import retrieve
from app.graph.nodes.generate import generate
from app.graph.nodes.validate import validate
from app.graph.nodes.analyze_image import analyze_image


def route_after_retrieve(state: DoctorState) -> str:
    if state.get("image_bytes"):
        return "analyze_image"

    return "generate"


builder = StateGraph(DoctorState)

builder.add_node("classify", classify)
builder.add_node("emergency", emergency)
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
        "retrieve": "retrieve",
    },
)

builder.add_edge("emergency", END)

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