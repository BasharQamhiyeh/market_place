# app/elastic.py
from elasticsearch import Elasticsearch

ES_HOST = "http://localhost:9200"
es = Elasticsearch(ES_HOST)
ITEM_INDEX = "items"

def create_item_index():
    """Create Elasticsearch index with ngram analyzer for title and description"""
    if not es.indices.exists(index=ITEM_INDEX):
        es.indices.create(
            index=ITEM_INDEX,
            body={
                "settings": {
                    "index.max_ngram_diff": 8,  # must be ≥ max_gram - min_gram
                    "analysis": {
                        "analyzer": {
                            "ngram_analyzer": {
                                "tokenizer": "ngram_tokenizer",
                                "filter": ["lowercase"]
                            }
                        },
                        "tokenizer": {
                            "ngram_tokenizer": {
                                "type": "ngram",
                                "min_gram": 2,
                                "max_gram": 10,
                                "token_chars": ["letter", "digit"]
                            }
                        }
                    }
                },
                "mappings": {
                    "properties": {
                        "id": {"type": "integer"},
                        "title": {"type": "text", "analyzer": "ngram_analyzer"},
                        "description": {"type": "text", "analyzer": "ngram_analyzer"},
                        "price": {"type": "float"},
                        "category": {"type": "keyword"},
                        "user_id": {"type": "integer"},
                        "created_at": {"type": "date"},
                        "attributes": {"type": "nested"}
                    }
                }
            }
        )


def index_item(doc: dict):
    """Index an item in Elasticsearch"""
    es.index(index=ITEM_INDEX, id=doc["id"], document=doc)


def search_items(query: str):
    # If no query is sent, return everything
    if not query:
        body = {"query": {"match_all": {}}}
    else:
        body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title", "description", "category", "attributes.value"],
                    "fuzziness": "AUTO",  # fixes typos
                    "operator": "or"
                }
            }
        }

    res = es.search(index=ITEM_INDEX, body=body)
    return [hit["_source"] for hit in res["hits"]["hits"]]