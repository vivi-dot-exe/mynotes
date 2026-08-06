def process_rag_event(event: dict) -> str:
    """
    Demonstrating Structural Pattern Matching (match/case).

    This concept goes far beyond a simple 'if/else' chain:
    1. It matches the SHAPE and TYPE of complex data (like dictionaries or tuples).
    2. It automatically extracts (unpacks) variables directly into local variables
       if the pattern fits!
    """
    match event:
        # Pattern 1: Matches a dict with action="upload" and extracts 'filename' + 'size_mb'
        case {"action": "upload", "file": filename, "size_mb": size}:
            return f"Processing document '{filename}' ({size} MB) into vector database..."

        # Pattern 2: Matches action="query" and extracts 'text', with a Guard Clause ('if') checking length
        case {"action": "query", "text": prompt} if len(prompt) < 5:
            return "Query is too short! Please provide a more specific prompt."

        # Pattern 3: Matches action="query" with any valid prompt text
        case {"action": "query", "text": prompt}:
            return f"Searching ChromaDB vector store for: '{prompt}'"

        # Pattern 4: Matches any dict having an 'error' key, regardless of other contents
        case {"error": error_code, **rest}:
            return f"System error encountered (Code: {error_code}). Extra context: {rest}"

        # Wildcard Pattern (_): Catch-all for any unmatched input
        case _:
            return "Unrecognized event format."


# --- Run & Test in VS Code ---
if __name__ == "__main__":
    # Test Cases demonstrating how pattern matching handles different structures
    test_events = [
        {"action": "upload", "file": "research_paper.pdf", "size_mb": 4.2},
        {"action": "query", "text": "Hi"},
        {"action": "query", "text": "What is hybrid retrieval?"},
        {"error": 404, "details": "Index not found", "timestamp": "2026-08-06"},
        {"status": "idle"}
    ]

    print("--- Testing Structural Pattern Matching ---")
    for event in test_events:
        result = process_rag_event(event)
        print(f"Input:  {event}")
        print(f"Output: {result}\n")