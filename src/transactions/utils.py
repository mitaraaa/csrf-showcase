from src.models import Transaction
from src.transactions.schemas import TransactionRead


def build_transaction(transaction: Transaction) -> TransactionRead:
    return TransactionRead(
        id=transaction.id,
        sender=transaction.sender.username,
        recipient=transaction.receiver.username,
        amount=transaction.amount,
        description=transaction.description,
        date=transaction.date,
    )
