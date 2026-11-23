from app.services.doctor_directory import list_doctors, DirectoryError

def select_doctor(state):
    try:
        doctors = list_doctors(state["specialty_slug"])
    except DirectoryError:
        doctors = []
    if not doctors:
        return {"decision": "no_doctor_available", "answer": "No AI doctor is available for this specialty right now."}
    requested_id = state.get("doctor_id")
    doctor = next((item for item in doctors if item.get("id") == requested_id), None)
    # Stable choice for triage-driven consultations.
    doctor = doctor or sorted(doctors, key=lambda x: str(x["id"]))[0]
    return {"doctor_id": str(doctor["id"]), "selected_doctor": doctor}
