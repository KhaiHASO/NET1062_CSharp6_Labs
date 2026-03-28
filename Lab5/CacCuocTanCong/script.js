const escapeHtml = (value) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const termContent = {
    dos: `<p><strong>DoS</strong> là kiểu tấn công làm cạn tài nguyên xử lý hoặc băng thông bằng cách tạo lượng truy cập bất thường.</p><p><strong>Rate limiting</strong> giới hạn số yêu cầu trong một khoảng thời gian. <strong>WAF</strong> lọc hành vi đáng ngờ trước khi đến ứng dụng. <strong>Load balancing</strong> phân phối tải giữa nhiều máy chủ.</p>`,
    xss: `<p><strong>XSS</strong> xảy ra khi dữ liệu không đáng tin cậy được render lên trình duyệt mà không được xử lý an toàn.</p><p><strong>Escape output</strong> biến ký tự điều khiển thành text vô hại. <strong>Sanitize</strong> loại bỏ hoặc cho phép có kiểm soát những thẻ HTML cụ thể.</p>`,
    cmd: `<p><strong>Command Injection</strong> xuất hiện khi input người dùng bị ghép trực tiếp vào câu lệnh hệ thống hoặc tác vụ shell.</p><p><strong>Allowlist validation</strong> chỉ cho phép tập ký tự hoặc mẫu hợp lệ. Thiết kế an toàn hơn là không dùng shell, mà gọi API hoặc hàm nội bộ có tham số rõ ràng.</p>`,
    sql: `<p><strong>SQL Injection</strong> là hiện tượng logic truy vấn thay đổi do ứng dụng ghép chuỗi đầu vào trực tiếp vào câu SQL.</p><p><strong>Parameterized query</strong> giữ câu lệnh SQL cố định và truyền dữ liệu người dùng như biến tách biệt.</p>`
};

const explainContent = {
    dos: {
        title: "DoS: cơ chế và phòng vệ",
        body: `<p>Mô phỏng này cho thấy một website bán vé từ trạng thái ổn định sang quá tải khi lượng request giả lập tăng mạnh. Các chỉ số CPU, thời gian phản hồi và khả năng phục vụ người dùng hợp lệ đều thay đổi theo thời gian.</p><p>Phòng thủ hiệu quả gồm rate limiting, caching, load balancing, CDN và WAF để hấp thụ hoặc chặn lưu lượng bất thường.</p>`
    },
    xss: {
        title: "XSS: unsafe render và safe render",
        body: `<p>Trong chế độ unsafe, nội dung không đáng tin cậy được đưa vào vùng hiển thị theo cách có thể làm thay đổi giao diện. Mô phỏng này chỉ hiển thị cảnh báo an toàn, không chèn script thật.</p><p>Trong chế độ safe, cùng nội dung đó được escape để chỉ hiển thị như văn bản.</p>`
    },
    cmd: {
        title: "Command Injection: vì sao nối chuỗi nguy hiểm",
        body: `<p>Nếu backend lấy input rồi ghép trực tiếp vào câu lệnh shell, dữ liệu có thể làm thay đổi câu lệnh dự kiến. Mô phỏng này chỉ thay đổi text và log để minh họa nguy cơ.</p><p>Giải pháp đúng là dùng validation nghiêm ngặt, tránh shell khi không cần, và gọi chức năng nội bộ với tham số rõ ràng.</p>`
    },
    sql: {
        title: "SQL Injection: ghép chuỗi so với tham số hóa",
        body: `<p>Ở chế độ unsafe, dữ liệu đầu vào làm câu truy vấn giả lập bị biến dạng và dẫn đến cảnh báo logic thay đổi. Ở chế độ safe, truy vấn giữ cấu trúc cố định và chỉ thay giá trị tham số.</p><p>Điểm chính ở đây là dữ liệu người dùng không bao giờ được phép quyết định cấu trúc SQL.</p>`
    }
};

const state = { intervals: {} };

const simulations = {
    dos: {
        step: 0,
        steps: [
            { requests: 1200, load: 21, response: 120, availability: 98, users: "Thông suốt", narrative: "Website bán vé đang xử lý lượng truy cập bình thường với phản hồi ổn định.", stage: "Ổn định", log: "[normal] Traffic baseline ổn định, hàng đợi request ở ngưỡng an toàn." },
            { requests: 6400, load: 56, response: 340, availability: 82, users: "Chậm nhẹ", narrative: "Hệ thống ghi nhận đột biến request giả lập và bắt đầu tăng độ trễ xử lý.", stage: "Bất thường", log: "[warn] Burst traffic tăng nhanh, autoscale giả lập bắt đầu phản ứng." },
            { requests: 15200, load: 88, response: 980, availability: 41, users: "Nhiều lỗi timeout", narrative: "Server gần chạm ngưỡng tài nguyên, session hợp lệ phải chờ lâu hoặc bị timeout.", stage: "Quá tải", log: "[critical] Queue depth tăng mạnh, worker xử lý không kịp lượng yêu cầu." },
            { requests: 24000, load: 99, response: 3200, availability: 12, users: "Bị từ chối / timeout", narrative: "Dịch vụ gián đoạn: người dùng hợp lệ không thể mua vé dù không làm gì sai.", stage: "Gián đoạn", log: "[down] Availability tụt mạnh, hệ thống ưu tiên bảo toàn lõi dịch vụ." }
        ],
        reset() {
            this.step = 0;
            this.render();
            setTimeline("dos-timeline", 0);
            clearLog("dos-log");
            appendLog("dos-log", "Telemetry đã reset. Chờ khởi chạy kịch bản DoS giả lập.");
        },
        render() {
            const current = this.steps[this.step];
            setText("dos-requests", current.requests.toLocaleString("vi-VN"));
            setText("dos-load", `${current.load}%`);
            setText("dos-load-label", `${current.load}%`);
            setText("dos-response", `${current.response.toLocaleString("vi-VN")} ms`);
            setText("dos-users", current.users);
            setText("dos-availability-label", `${current.availability}%`);
            setText("dos-stage", current.stage);
            setText("dos-narrative", current.narrative);
            setProgress("dos-load-bar", current.load);
            setProgress("dos-availability-bar", current.availability);
        },
        tick() {
            this.render();
            setTimeline("dos-timeline", this.step);
            appendLog("dos-log", this.steps[this.step].log);
            if (this.step < this.steps.length - 1) {
                this.step += 1;
            } else {
                stopSimulation("dos");
                appendLog("dos-log", "[info] Mô phỏng hoàn tất. Xem phần giải thích để hiểu biện pháp phòng vệ.");
            }
        }
    },
    xss: {
        step: 0,
        mode: "unsafe",
        sampleInput: `<img src="[đã_ẩn]" onevent="[đã_làm_mờ]"> Bình luận khuyến mãi`,
        steps: [
            "Người dùng nhập nội dung bình luận có chứa ký tự điều khiển đáng ngờ.",
            "Ứng dụng lấy lại nội dung từ form và chuẩn bị render lên giao diện.",
            "Unsafe render sẽ coi nội dung như markup; safe render sẽ escape thành text.",
            "UI hiển thị cảnh báo để minh họa việc giao diện có thể bị chèn nội dung ngoài ý muốn."
        ],
        reset() {
            this.step = 0;
            this.render();
            clearLog("xss-log");
            appendLog("xss-log", "Bộ mô phỏng XSS đã sẵn sàng. Không có script thật nào được thực thi.");
        },
        render() {
            setText("xss-input-preview", this.sampleInput);
            setText("xss-narrative", this.steps[this.step]);
            const renderBox = document.getElementById("xss-render-box");
            const alert = document.getElementById("xss-alert");
            if (this.mode === "unsafe") {
                renderBox.innerHTML = `<div class="log-line"><span>[unsafe]</span> Comment được đưa thẳng vào vùng render.</div><div class="log-line">Kết quả: giao diện xuất hiện một khối cảnh báo mô phỏng thay vì chỉ là văn bản thuần.</div><div class="alert-banner">Mô phỏng: nội dung không đáng tin cậy đang tác động tới DOM hiển thị.</div>`;
                alert.textContent = "Unsafe render có thể khiến dữ liệu người dùng được hiểu như markup thay vì text.";
            } else {
                renderBox.textContent = escapeHtml(this.sampleInput);
                alert.textContent = "Safe render đang escape toàn bộ ký tự điều khiển, nên nội dung chỉ xuất hiện như văn bản.";
            }
        },
        tick() {
            appendLog("xss-log", `[${this.mode}] ${this.steps[this.step]}`);
            this.render();
            if (this.step < this.steps.length - 1) {
                this.step += 1;
            } else {
                stopSimulation("xss");
                appendLog("xss-log", "[done] Hoàn tất mô phỏng XSS. So sánh lại hai chế độ render.");
            }
        }
    },
    cmd: {
        step: 0,
        mode: "unsafe",
        steps: [
            { unsafe: "ping intranet-gateway && [blocked-demo]", safe: "ping intranet-gateway", narrative: "Input ban đầu nhìn giống tên host nhưng chứa thêm phần tử bất thường.", progress: 24, log: "[check] Phân tích chuỗi nhập để tạo câu lệnh giả lập." },
            { unsafe: "ping intranet-gateway && [blocked-demo]", safe: "validation_failed: ký tự không hợp lệ đã bị chặn", narrative: "Unsafe concatenation giữ nguyên chuỗi ghép, còn safe validation phát hiện ký tự ngoài allowlist.", progress: 58, log: "[warn] Logic câu lệnh dự kiến đã bị thay đổi trong chế độ unsafe." },
            { unsafe: "ping intranet-gateway && [blocked-demo]", safe: "ping intranet-gateway", narrative: "Terminal giả lập ghi nhận cảnh báo, nhưng không thực thi bất kỳ lệnh hệ thống nào.", progress: 100, log: "[safe] Chế độ an toàn chỉ chấp nhận host hợp lệ và loại bỏ chuỗi bất thường." }
        ],
        reset() {
            this.step = 0;
            this.render();
            clearLog("cmd-log");
            appendLog("cmd-log", "Terminal giả lập khởi tạo. Không có shell thật nào được gọi.");
        },
        render() {
            const current = this.steps[this.step];
            setText("cmd-builder", `$ ${this.mode === "unsafe" ? current.unsafe : current.safe}`);
            setText("cmd-narrative", current.narrative);
            setProgress("cmd-progress", current.progress);
        },
        tick() {
            this.render();
            appendLog("cmd-log", `[${this.mode}] ${this.steps[this.step].log}`);
            if (this.step < this.steps.length - 1) {
                this.step += 1;
            } else {
                stopSimulation("cmd");
                appendLog("cmd-log", "[done] Mô phỏng command injection kết thúc. Kiểm tra khác biệt giữa validate và nối chuỗi.");
            }
        }
    },
    sql: {
        step: 0,
        mode: "unsafe",
        user: "admin_demo",
        pass: "[masked_input]",
        rows: [
            ["U-104", "customer", "active", "Chỉ 1 bản ghi phù hợp"],
            ["U-007", "support", "active", "Có nguy cơ xuất hiện ngoài ý muốn"],
            ["U-001", "admin", "active", "Có thể bị lộ nếu logic lọc sai"]
        ],
        steps: [
            { unsafe: "SELECT * FROM users WHERE username = 'admin_demo' AND password = '[blurred || altered]';", safe: "SELECT * FROM users WHERE username = ? AND password = ?;", narrative: "Ứng dụng chuẩn bị truy vấn xác thực từ dữ liệu form đăng nhập giả lập.", alert: "Chưa phát hiện thay đổi logic. Hệ thống đang dựng câu truy vấn." },
            { unsafe: "SELECT * FROM users WHERE username = 'admin_demo' AND password = '[logic_changed_demo]';", safe: "SELECT * FROM users WHERE username = ? AND password = ?;  -- params: ['admin_demo', '[masked_input]']", narrative: "Unsafe query building làm cấu trúc điều kiện thay đổi theo dữ liệu đầu vào.", alert: "Cảnh báo: logic truy vấn bị thay đổi trong mô phỏng unsafe." },
            { unsafe: "SELECT * FROM users WHERE username = 'admin_demo' AND password = '[logic_changed_demo]';", safe: "SELECT * FROM users WHERE username = ? AND password = ?;  -- params bound safely", narrative: "Parameterized query giữ nguyên cấu trúc SQL và chỉ truyền dữ liệu như tham số.", alert: "Safe mode: truy vấn được tham số hóa, dữ liệu không thể trở thành cú pháp SQL." }
        ],
        reset() {
            this.step = 0;
            setText("sql-user", this.user);
            setText("sql-pass", this.pass);
            this.render();
            renderSqlTable(false);
        },
        render() {
            const current = this.steps[this.step];
            document.getElementById("sql-query-box").textContent = this.mode === "unsafe" ? current.unsafe : current.safe;
            setText("sql-narrative", current.narrative);
            setText("sql-alert", current.alert);
            renderSqlTable(this.mode === "unsafe" && this.step >= 1);
        },
        tick() {
            this.render();
            if (this.step < this.steps.length - 1) {
                this.step += 1;
            } else {
                stopSimulation("sql");
            }
        }
    }
};

function setText(id, value) { document.getElementById(id).textContent = value; }
function setProgress(id, value) { document.getElementById(id).style.width = `${Math.max(0, Math.min(value, 100))}%`; }

function appendLog(id, text) {
    const log = document.getElementById(id);
    const line = document.createElement("div");
    line.className = "log-line";
    line.innerHTML = `<span>${new Date().toLocaleTimeString("vi-VN")}</span> ${escapeHtml(text)}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

function clearLog(id) { document.getElementById(id).innerHTML = ""; }

function setTimeline(id, activeIndex) {
    document.querySelectorAll(`#${id} li`).forEach((item, index) => item.classList.toggle("active", index === activeIndex));
}

function startSimulation(key) {
    stopSimulation(key);
    document.getElementById("global-status").textContent = `Đang chạy: ${key.toUpperCase()}`;
    simulations[key].tick();
    state.intervals[key] = window.setInterval(() => simulations[key].tick(), 1600);
}

function stopSimulation(key) {
    if (state.intervals[key]) {
        clearInterval(state.intervals[key]);
        delete state.intervals[key];
    }
    document.getElementById("global-status").textContent = "Tạm dừng";
}

function resetSimulation(key) {
    stopSimulation(key);
    simulations[key].reset();
    document.getElementById("global-status").textContent = "Sẵn sàng";
}

function renderSqlTable(showRisk) {
    const body = document.getElementById("sql-table");
    body.innerHTML = "";
    simulations.sql.rows.forEach((row, index) => {
        const tr = document.createElement("tr");
        row.forEach((cell, cellIndex) => {
            const td = document.createElement("td");
            td.textContent = showRisk && index > 0 && cellIndex === 3 ? "Xuất hiện ngoài phạm vi mong đợi" : cell;
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
}

function setMode(simKey, mode) {
    simulations[simKey].mode = mode;
    simulations[simKey].render();
    if (simKey === "xss") appendLog("xss-log", `[mode] Chuyển sang ${mode} render.`);
    if (simKey === "cmd") appendLog("cmd-log", `[mode] Chuyển sang ${mode} validation flow.`);
    if (simKey === "sql") setText("global-status", `Chế độ ${mode} cho SQL`);
}

function openModal(title, body) {
    setText("modal-title", title);
    document.getElementById("modal-content").innerHTML = body;
    document.getElementById("explain-modal").classList.remove("hidden");
    document.getElementById("explain-modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
    document.getElementById("explain-modal").classList.add("hidden");
    document.getElementById("explain-modal").setAttribute("aria-hidden", "true");
}

function initTabs() {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach((tab) => tab.classList.remove("active"));
            document.querySelectorAll(".attack-panel").forEach((panel) => panel.classList.remove("active"));
            button.classList.add("active");
            document.getElementById(button.dataset.target).classList.add("active");
        });
    });
}

function initControls() {
    document.querySelectorAll(".attack-panel").forEach((panel) => {
        const simKey = panel.dataset.sim;
        panel.querySelectorAll(".action-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const action = button.dataset.action;
                if (action === "start") startSimulation(simKey);
                if (action === "pause") stopSimulation(simKey);
                if (action === "reset") resetSimulation(simKey);
                if (action === "explain") openModal(explainContent[simKey].title, explainContent[simKey].body);
            });
        });
    });

    document.querySelectorAll(".mode-switch").forEach((group) => {
        group.querySelectorAll(".mode-btn").forEach((button) => {
            button.addEventListener("click", () => {
                group.querySelectorAll(".mode-btn").forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");
                setMode(group.dataset.modeGroup, button.dataset.mode);
            });
        });
    });
}

function initHelp() {
    document.querySelectorAll(".hint-chip").forEach((chip) => {
        chip.addEventListener("click", () => openModal("Giải thích thuật ngữ", termContent[chip.dataset.term]));
    });
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("explain-modal").addEventListener("click", (event) => {
        if (event.target.id === "explain-modal") closeModal();
    });
}

function init() {
    initTabs();
    initControls();
    initHelp();
    Object.values(simulations).forEach((sim) => sim.reset());
    document.getElementById("global-status").textContent = "Sẵn sàng";
}

document.addEventListener("DOMContentLoaded", init);
