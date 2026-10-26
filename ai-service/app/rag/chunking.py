from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_documents(documents):
    return RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100).split_documents(documents)
