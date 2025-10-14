"use client";

import React from "react";
import styles from "./page.module.css";


interface SidebarProps {
    total: number;
    current: number;
}

export default function Sidebar({ total, current }: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <div>
                <span>{current}/{total}</span>
            </div>
        </div>
    );
}
