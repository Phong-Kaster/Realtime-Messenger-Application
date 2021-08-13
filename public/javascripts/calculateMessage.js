function increaseMessageQuantity(dataChat){
    let currentQuantity = Number($(`.right[data-chat=${dataChat}]`).find("span .show-quantity-message").text());
    currentQuantity++;

    $(`.right[data-chat=${dataChat}]`).find("span .show-quantity-message").html(currentQuantity);
}