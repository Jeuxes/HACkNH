import {StyleSheet, Text, TouchableOpacity} from "react-native";
import * as styles_ from "../../styles";
import React from "react";

const TextIconButton = ({onPress, style, title, textStyle, icon, disabled }, props) => {
    return (
        <TouchableOpacity style={[styles.button, style, disabled && styles.disabled_button]} disabled={disabled} onPress={onPress} {...props}>
            {icon}
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        borderWidth: 1.4, borderRadius: 40,
        marginHorizontal: 20, elevation: 5, height: 55
    },
    disabled_button: {
        backgroundColor: styles_.LIGHTEST_GRAY,
        borderColor: styles_.LIGHTEST_GRAY,
        color: styles_.LIGHT_GRAY,
    }
});

export default TextIconButton;