import {
    InstructionKey,
    INSTRUCTION_ICON_MAP,
    INSTRUCTION_KEYS,
} from "../constants/constants";

const IconizedInstructionPanel = ({
    programKeyDown,
    onPress,
}: {
    programKeyDown: { [key: InstructionKey]: boolean };
    onPress: (key: InstructionKey) => void;
}) => {
    let colors: { [key: InstructionKey]: string } = {};
    INSTRUCTION_KEYS.map((key, key_i) => {
        const isDown = programKeyDown[key];
        if (isDown) {
            colors[key] = "#FFFE71";
        } else {
            colors[key] = "#FFFFFFFF";
        }
    });
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                margin: "0rem 0 2rem 0",
                justifyContent: "center",
            }}
        >
            {INSTRUCTION_KEYS.map((key, key_i) => {
                return (
                    <div
                        key={`iconized-instruction-${key_i}`}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "center",
                            width: "2.5rem",
                            marginRight: "0.3rem",
                            padding: "0.3rem",
                            border: "1px solid #CCCCCC",
                            borderRadius: "0.8rem",
                            backgroundColor: colors[key],
                            transitionDuration: "50ms",
                            cursor: "pointer",
                        }}
                        onClick={() => onPress(key)}
                    >
                        <i
                            className="material-icons"
                            style={{ fontSize: "1rem" }}
                        >
                            {INSTRUCTION_ICON_MAP[key]}
                        </i>
                        <p style={{ marginTop: "0.1rem", marginBottom: "0" }}>
                            {key}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default IconizedInstructionPanel;
