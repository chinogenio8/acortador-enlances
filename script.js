document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const shortenBtn = document.getElementById("shortenBtn");
  const longUrlInput = document.getElementById("longUrl");
  const resultDiv = document.getElementById("result");
  const shortUrlInput = document.getElementById("shortUrl");
  const copyBtn = document.getElementById("copyBtn");
  const qrLink = document.getElementById("qrLink");
  const visitLink = document.getElementById("visitLink");
  const historySection = document.getElementById("historySection");
  const historyList = document.getElementById("historyList");

  // Manejar el cambio de tema
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Alternar visibilidad de los logos
    document.querySelectorAll(".theme-logo").forEach((logo) => {
      logo.classList.toggle("hidden");
    });
  });

  // Cargar tema guardado al iniciar
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    document.querySelectorAll(".theme-logo").forEach((logo) => {
      logo.classList.toggle("hidden");
    });
  }

  // Cargar historial desde localStorage
  let linksHistory = JSON.parse(localStorage.getItem("shortenedLinks")) || [];
  renderHistory();

  // Acortar URL
  shortenBtn.addEventListener("click", async () => {
    const longUrl = longUrlInput.value.trim();

    if (!isValidUrl(longUrl)) {
      alert("Por favor ingresa una URL válida (ej: https://tusitio.com)");
      return;
    }

    try {
      // Mostrar carga
      shortenBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Acortando...';
      shortenBtn.disabled = true;

      // Simular acortamiento (en producción, usa una API real)
      const shortCode = generateRandomCode(6);
      const shortUrl = `https://acort.ar/${shortCode}`;

      // Mostrar resultado
      shortUrlInput.value = shortUrl;
      resultDiv.classList.remove("hidden");
      visitLink.href = shortUrl;
      qrLink.href = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        shortUrl
      )}`;

      // Guardar en historial
      linksHistory.unshift({
        longUrl,
        shortUrl,
        date: new Date().toLocaleString(),
      });

      if (linksHistory.length > 5) linksHistory.pop();
      localStorage.setItem("shortenedLinks", JSON.stringify(linksHistory));
      renderHistory();
    } catch (error) {
      alert("Error al acortar el enlace. Intenta nuevamente.");
      console.error(error);
    } finally {
      // Restaurar botón
      shortenBtn.innerHTML = "Acortar";
      shortenBtn.disabled = false;
    }
  });

  // Copiar enlace
  copyBtn.addEventListener("click", () => {
    shortUrlInput.select();
    document.execCommand("copy");
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="far fa-copy"></i>';
    }, 2000);
  });

  // Generar código aleatorio
  function generateRandomCode(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validar URL
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Mostrar historial
  function renderHistory() {
    if (linksHistory.length === 0) {
      historySection.classList.add("hidden");
      return;
    }

    historySection.classList.remove("hidden");
    historyList.innerHTML = linksHistory
      .map(
        (link) => `
        <li class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
          <div class="truncate mr-2">
            <a href="${
              link.shortUrl
            }" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">${link.shortUrl.replace(
          "https://",
          ""
        )}</a>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${
              link.longUrl
            }</p>
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-300 whitespace-nowrap">${
            link.date
          }</span>
        </li>
      `
      )
      .join("");
  }
});
