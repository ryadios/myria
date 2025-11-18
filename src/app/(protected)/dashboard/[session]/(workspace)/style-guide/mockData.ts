import { StyleGuide } from "@/redux/api/style-guide";

export const mockStyleGuide: StyleGuide = {
    theme: "Default Theme",
    description: "A sample style guide for demonstration with optional fields included.",

    colorSections: [
        {
            title: "Primary Colors",
            swatches: [
                {
                    name: "Primary 500",
                    hexColor: "#3B82F6",
                    description: "Main brand blue used for primary actions",
                },
                {
                    name: "Primary 600",
                    hexColor: "#2563EB",
                    description: "Darker shade used for hover states",
                },
            ],
        },
        {
            title: "Secondary & Accent Colors",
            swatches: [
                {
                    name: "Accent Pink",
                    hexColor: "#EC4899",
                    description: "Highlight and playful tone",
                },
                {
                    name: "Accent Yellow",
                    hexColor: "#EAB308",
                    description: "Attention-grabbing accent",
                },
            ],
        },
        {
            title: "UI Component Colors",
            swatches: [
                {
                    name: "Card Background",
                    hexColor: "#FFFFFF",
                    description: "Base background for surfaces",
                },
                {
                    name: "Border Subtle",
                    hexColor: "#E5E7EB",
                    description: "Light border for separators",
                },
            ],
        },
        {
            title: "Utility & Form Colors",
            swatches: [
                {
                    name: "Input Background",
                    hexColor: "#F9FAFB",
                    description: "Background for input fields",
                },
                {
                    name: "Input Border",
                    hexColor: "#D1D5DB",
                    description: "Standard input border",
                },
            ],
        },
        {
            title: "Status & Feedback Colors",
            swatches: [
                {
                    name: "Success",
                    hexColor: "#10B981",
                    description: "Used for positive states",
                },
                {
                    name: "Error",
                    hexColor: "#EF4444",
                    description: "Used for destructive or error states",
                },
                {
                    name: "Warning",
                    hexColor: "#F59E0B",
                    description: "Used for cautionary indicators",
                },
            ],
        },
    ],

    typographySections: [
        {
            title: "Headings",
            styles: [
                {
                    name: "H1",
                    fontFamily: "Inter",
                    fontSize: "32px",
                    fontWeight: "700",
                    lineHeight: "40px",
                    letterSpacing: "-0.5px",
                    description: "Main page title style",
                },
                {
                    name: "H2",
                    fontFamily: "Inter",
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "32px",
                    letterSpacing: "-0.25px",
                    description: "Section title style",
                },
            ],
        },
        {
            title: "Body Text",
            styles: [
                {
                    name: "Body 1",
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: "400",
                    lineHeight: "24px",
                    description: "Default content text",
                },
                {
                    name: "Body 2",
                    fontFamily: "Inter",
                    fontSize: "14px",
                    fontWeight: "400",
                    lineHeight: "20px",
                    description: "Secondary content text",
                },
            ],
        },
        {
            title: "Captions & Labels",
            styles: [
                {
                    name: "Caption",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "16px",
                    letterSpacing: "0.5px",
                    description: "Small descriptive text",
                },
                {
                    name: "Label",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    fontWeight: "500",
                    lineHeight: "16px",
                    letterSpacing: "0px",
                    description: "Form labels and UI tags",
                },
            ],
        },
    ],
};
