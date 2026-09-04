const canvas = document.getElementById("flex-canvas");
const flexDirection = document.getElementById("flex-direction");
const justifyContent = document.getElementById("justify-content");
const alignItems = document.getElementById("align-items");
const flexWrap = document.getElementById("flex-wrap");
const flexGap = document.getElementById("flex-gap");
const gapVal = document.getElementById("gap-val");

const addItemBtn = document.getElementById("add-item-btn");
const removeItemBtn = document.getElementById("remove-item-btn");
const itemsCount = document.getElementById("items-count");

const flexCode = document.getElementById("flex-code");
const copyFlexBtn = document.getElementById("copy-flex-btn");


function updateFlexbox() {
    const direction = flexDirection.value;
    const justify = justifyContent.value;
    const align = alignItems.value;
    const wrap = flexWrap.value;
    const gap = flexGap.value;

    gapVal.textContent = gap + "px";

   
    canvas.style.flexDirection = direction;
    canvas.style.justifyContent = justify;
    canvas.style.alignItems = align;
    canvas.style.flexWrap = wrap;
    canvas.style.gap = gap + "px";

   
    flexCode.textContent = `.contenedor {
    display: flex;
    flex-direction: ${direction};
    justify-content: ${justify};
    align-items: ${align};
    flex-wrap: ${wrap};
    gap: ${gap}px;
}`;

    const totalItems = canvas.querySelectorAll(".flex-item").length;
    itemsCount.textContent = `${totalItems} ${totalItems === 1 ? "elemento" : "elementos"}`;
}



[flexDirection, justifyContent, alignItems, flexWrap].forEach(select => {
    select.addEventListener("change", updateFlexbox);
});

flexGap.addEventListener("input", updateFlexbox);



addItemBtn.addEventListener("click", function() {
    const totalItems = canvas.querySelectorAll(".flex-item").length;
    if (totalItems >= 10) return;

    const newItem = document.createElement("div");
    newItem.className = "flex-item";
    newItem.textContent = totalItems + 1;

    canvas.appendChild(newItem);
    updateFlexbox();
});

removeItemBtn.addEventListener("click", function() {
    const items = canvas.querySelectorAll(".flex-item");
    if (items.length <= 1) return;

    items[items.length - 1].remove();
    updateFlexbox();
});



copyFlexBtn.addEventListener("click", function() {
    navigator.clipboard.writeText(flexCode.textContent);
    copyFlexBtn.textContent = "✓ Copiado";

    setTimeout(function() {
        copyFlexBtn.textContent = "📋 Copiar CSS";
    }, 1500);
});


updateFlexbox();