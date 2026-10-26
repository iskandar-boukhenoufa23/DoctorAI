import argparse
from pathlib import Path
from app.rag.ingestion import extract_pdf, ingest_text

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("file", type=Path)
    parser.add_argument("--scope", default="public")
    args = parser.parse_args()
    raw = args.file.read_bytes()
    content = extract_pdf(raw) if args.file.suffix.lower() == ".pdf" else raw.decode("utf-8")
    print("Indexed chunks:", ingest_text(content, args.file.name, args.scope))

if __name__ == "__main__":
    main()
