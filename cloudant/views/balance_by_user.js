function (doc) {
    if (doc.doc_type == 'transaction') {
        var amount = doc.amount;
        if (doc.type == 'payment') {
            amount *= -1;
        }
        emit(doc.userid, amount);
    }
}