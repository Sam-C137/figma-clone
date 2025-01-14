import {
    fontFamilyOptions,
    fontSizeOptions,
    fontWeightOptions,
} from "@/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const selectConfigs = [
    {
        property: "fontFamily",
        placeholder: "Choose a font",
        options: fontFamilyOptions,
    },
    { property: "fontSize", placeholder: "30", options: fontSizeOptions },
    {
        property: "fontWeight",
        placeholder: "Semibold",
        options: fontWeightOptions,
    },
];

interface TextProps {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    handleInputChange: (property: string, value: string) => void;
}

export function Text({
    fontFamily,
    fontSize,
    fontWeight,
    handleInputChange,
}: TextProps) {
    return (
        <div className="flex flex-col gap-3 border-b border-primary-grey-200 px-5 py-3">
            <h3 className="text-[10px] uppercase">Text</h3>

            <div className="flex flex-col gap-3">
                {RenderSelect({
                    config: selectConfigs[0],
                    fontSize,
                    fontWeight,
                    fontFamily,
                    handleInputChange,
                })}

                <div className="flex gap-2">
                    {selectConfigs.slice(1).map((config) => (
                        <RenderSelect
                            key={config.property}
                            config={config}
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            fontFamily={fontFamily}
                            handleInputChange={handleInputChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface RenderSelectProps {
    config: {
        property: string;
        placeholder: string;
        options: { label: string; value: string }[];
    };
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    handleInputChange: (property: string, value: string) => void;
}

function RenderSelect({
    config,
    fontSize,
    fontWeight,
    fontFamily,
    handleInputChange,
}: RenderSelectProps) {
    return (
        <Select
            key={config.property}
            onValueChange={(value) => handleInputChange(config.property, value)}
            value={
                config.property === "fontFamily"
                    ? fontFamily
                    : config.property === "fontSize"
                      ? fontSize
                      : fontWeight
            }
        >
            <SelectTrigger className="no-ring w-full rounded-sm border border-primary-grey-200 bg-transparent">
                <SelectValue
                    placeholder={
                        config.property === "fontFamily"
                            ? "Choose a font"
                            : config.property === "fontSize"
                              ? "30"
                              : "Semibold"
                    }
                />
            </SelectTrigger>
            <SelectContent className="border-primary-grey-200 bg-primary-black text-primary-grey-300">
                {config.options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-primary-green hover:text-primary-black"
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
