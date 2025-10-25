// Create portal root for modals if it doesn't exist
try {
  if (!document.getElementById("modal-root")) {
    console.log("Creating modal root element");
    const modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    modalRoot.style.position = "fixed";
    modalRoot.style.zIndex = "999999999";
    modalRoot.style.top = "0";
    modalRoot.style.left = "0";
    modalRoot.style.width = "100%";
    modalRoot.style.height = "100%";
    modalRoot.style.pointerEvents = "none";
    document.body.appendChild(modalRoot);
    console.log("Modal root element created successfully");
  } else {
    console.log("Modal root already exists");
  }
} catch (error) {
  console.error("Error creating modal root:", error);
}
