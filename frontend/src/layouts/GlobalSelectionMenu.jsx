import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import "./GlobalSelectionMenu.css";
import { apiFetch } from "../utils/wrappers";

export default function GlobalSelectionMenu() {
	const [menu, setMenu] = useState({
		visible: false,
		x: 0,
		y: 0,
		text: ""
	});
    const menuRef = useRef(null);

    useLayoutEffect(() => {
        if (!menu.visible || !menuRef.current) return;

        const padding = 8;
        const rect = menuRef.current.getBoundingClientRect();

        let nextX = menu.x;
        let nextY = menu.y;

        if (rect.right > window.innerWidth - padding) {
            nextX = Math.max(padding, window.innerWidth - rect.width - padding);
        }

        if (rect.bottom > window.innerHeight - padding) {
            nextY = Math.max(padding, window.innerHeight - rect.height - padding);
        }

        if (nextX !== menu.x || nextY !== menu.y) {
            setMenu((prev) => ({
                ...prev,
                x: nextX,
                y: nextY
            }));
        }
    }, [menu.visible, menu.x, menu.y, menu.text]);

	useEffect(() => {
		function getSelectedText() {
            // Get only first word, no spaces, lowercase
			return window.getSelection()?.toString().trim().replace(/[^a-zA-Z\s]/g, '').split(" ")[0].toLowerCase() || "";
		}

		function handleContextMenu(e) {
			const selectedText = getSelectedText();

			if (!selectedText) {
				setMenu((prev) => ({ ...prev, visible: false }));
				return;
			}

			e.preventDefault();

			setMenu({
				visible: true,
				x: e.clientX,
				y: e.clientY,
				text: selectedText
			});
		}

		function handleClick() {
			setMenu((prev) => ({ ...prev, visible: false }));
		}

		function handleScroll() {
			setMenu((prev) => ({ ...prev, visible: false }));
		}

		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("click", handleClick);
		window.addEventListener("scroll", handleScroll);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("click", handleClick);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	async function sendSelectedText() {
		try {
            await apiFetch("/api/words", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({words: [menu.text]}),
            });

			setMenu((prev) => ({ ...prev, visible: false }));
		} catch (error) {
			console.error("Failed to send selected text:", error);
		}
	}

	if (!menu.visible) return null;

	return (
		<div
            ref={menuRef}
            className="word-selection-menu"
			style={{
				top: menu.y,
				left: menu.x
			}}
			onClick={(e) => e.stopPropagation()}
		>
			<button onClick={sendSelectedText}>
				Save to learn: "{menu.text}"
			</button>
		</div>
	);
}