// script.js — обновлённый и проверенный

document.addEventListener("DOMContentLoaded", () => {
    // ----------------- МУЗЫКА -----------------
    const playBtn = document.getElementById('playBtn');
    const music = document.getElementById('bgMusic');

    if (!playBtn || !music) {
        console.warn("playBtn или bgMusic не найден(ы). Музыка работать не будет.");
    } else {
        let isPlaying = false;

        async function safePlay() {
            try {
                const p = music.play();
                if (p !== undefined) await p;
                isPlaying = true;
                playBtn.textContent = '⏸';
            } catch (err) {
                console.warn("Не удалось запустить музыку:", err);
            }
        }

        function safePause() {
            try {
                music.pause();
                isPlaying = false;
                playBtn.textContent = '▶';
            } catch (err) {
                console.warn("Не удалось поставить на паузу музыку:", err);
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isPlaying) safePlay();
            else safePause();
        });

        music.addEventListener('ended', () => {
            isPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
        });
    }

    // ----------------- ФОРМА (WhatsApp + Telegram) -----------------
    const form = document.getElementById("rsvpForm");
    const formMsg = document.getElementById("formMsg");

    if (!form) {
        console.error("Форма #rsvpForm не найдена на странице — обработчик не будет работать.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const name = nameInput ? nameInput.value.trim() : "";
        const attendance = document.querySelector('input[name="attendance"]:checked')?.value;

        if (!name || !attendance) {
            formMsg.textContent = "Пожалуйста, заполните все поля.";
            formMsg.style.color = "red";
            return;
        }

        // 🔹 Твои данные (уже вставлены)
        const BOT_TOKEN = '8371046136:AAHcJECyGIePgrF9cpaMs2tbu-YESJxBX0E';
        const CHAT_ID = '6335564227';
        const telegramText = `🎉 Новая заявка с сайта QYZ UZATU:\n\n👤 Имя: ${name}\n📋 Ответ: ${attendance}\n🧑 Отправил: Манас Адиль\n🌐 Язык: ru`;

        // --- Отправка в Telegram ---
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: CHAT_ID, text: telegramText })
            });
            console.log("✅ Отправлено в Telegram.");
        } catch (err) {
            console.warn("Ошибка при отправке в Telegram:", err);
        }

        // --- Открытие WhatsApp ---
        const phone = "77024657723"; // твой номер без "+"
        const waMessage = `Салеметсиз бе! Мен RSVP формасын толтырдым:%0A👤 Имя: ${encodeURIComponent(name)}%0A📋 Ответ: ${encodeURIComponent(attendance)}`;
        const waUrl = `https://wa.me/${phone}?text=${waMessage}`;

        let opened = false;
        try {
            const newWin = window.open(waUrl, "_blank");
            if (newWin) {
                opened = true;
                newWin.focus();
            }
        } catch (err) {
            console.warn("window.open заблокирован:", err);
        }

        if (!opened) {
            window.location.href = waUrl;
        }

        formMsg.textContent = "Перенаправляем в WhatsApp...";
        formMsg.style.color = "green";

        setTimeout(() => form.reset(), 600);
    });
});
