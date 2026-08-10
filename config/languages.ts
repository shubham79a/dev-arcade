import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";

export type LanguageConfig = {
    name: string;
    displayName: string;
    extensions: string[];
    codemirrorLang: () => any;
    judge0Id: number;
    defaultFilename: string;
    defaultCode: string;
};

export const LANGUAGES: Record<string, LanguageConfig> = {
    python: {
        name: "python",
        displayName: "Python 3",
        extensions: ["py"],
        codemirrorLang: python,
        judge0Id: 71,
        defaultFilename: "/main.py",
        defaultCode: '# Write your Python code here\nprint("Hello, World!")\n',
    },
    cpp: {
        name: "cpp",
        displayName: "C++",
        extensions: ["cpp", "c", "h", "hpp"],
        codemirrorLang: cpp,
        judge0Id: 54,
        defaultFilename: "/main.cpp",
        defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`,
    },
    java: {
        name: "java",
        displayName: "Java",
        extensions: ["java"],
        codemirrorLang: java,
        judge0Id: 62,
        defaultFilename: "/Main.java",
        defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
    },
};

// Check if an editorType should use the web preview (Sandpack)
export const isWebEditorType = (editorType: string | undefined | null): boolean => {
    return !editorType || editorType === "web" || editorType === "static" || editorType === "react";
};

// Get language config for a non-web editorType, or null if web
export const getLanguageConfig = (editorType: string | undefined | null): LanguageConfig | null => {
    if (isWebEditorType(editorType)) return null;
    return LANGUAGES[editorType!] || null;
};
