import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import { View, Text, Button, Image, TouchableOpacity, Modal, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import * as styles_ from "../styles";
import TextIconButton from "./TextIconButton";
import CloseIcon from '@mui/icons-material/Close';

const screenHeight = Dimensions.get('window').height;

const BottomDrawer = forwardRef(({ isVisible, children, onClose, }, ref) => {
    const [currentSnap, setCurrentSnap] = useState(0);
    const panY = useRef(new Animated.Value(screenHeight)).current;

    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0, duration: 200, useNativeDriver: true,
    });

    const closeAnim = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
    });

    const fullScreenAnim = Animated.timing(panY, {
        toValue: -300, // Would move modal to full screen
        duration: 500,
        useNativeDriver: true,
    });

    const panResponders = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gs) => {
                if (gs.dy > 0 && gs.vy > 2) {
                    return closeAnim.start(() => onClose());
                }
                // else if (gs.dy < -200) { // Assuming -100 is your threshold for swiping up to go full screen
                //     console.log("Starting full screen")
                //     resetPositionAnim.stop();
                //     return fullScreenAnim.start(); // Transition to full screen
                // }
                return resetPositionAnim.start();
            },
        })
    ).current;

    useEffect(() => {
        if (isVisible) {resetPositionAnim.start();}
        else {closeAnim.start();}
    }, [isVisible, closeAnim, resetPositionAnim]);

    return (
        <Modal visible={isVisible} backdropColor={"transparent"} style={styles.modal} presentationStyle={'overFullScreen'}>
            <Animated.View style={[styles.drawerContainer, { transform: [{ translateY: panY }] }]}>
                <View style={styles.container}>
                    <TextIconButton
                        style={[styles.button, styles.close_button]}
                        onPress={() => {
                            closeAnim.start()
                        }}
                        icon={<CloseIcon color={styles_.DARK_GRAY} size={28}/>}
                    />
                    <Animated.View style={styles.horizontalBar} {...panResponders.panHandlers} />
                    {children}
                    {/* Extra space at the bottom */}
                    <View style={{ height: screenHeight }} />
                </View>
            </Animated.View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
        left: '2%',
        width: '96%',
        top: screenHeight/2, // Hard coded fix to modal filling entire screen
    },
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    drawerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        maxHeight: '100%',
    },
    horizontalBar: {
        width: 100,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#ccc',
        marginTop: 5,
        marginBottom: 20,
        alignSelf: "center",
    },
    button: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 40, marginTop: 15, height: 55, marginHorizontal: 10, elevation: 5,
    },
    close_button: {
        position: 'absolute', top: -10, left: -5,
        width: 40, height: 40,borderColor: 'transparent',
    },
});

export default BottomDrawer;