import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import { View, Text, Button, Image, TouchableOpacity, Modal, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import * as styles_ from "../styles";
import TextIconButton from "./TextIconButton";
import CloseIcon from '@mui/icons-material/Close';

const screenHeight = Dimensions.get('window').height;

const BottomDrawer = forwardRef(({ isVisible, onClose, children, }, ref) => {
    const [isFullyOpen, setFullyOpen] = React.useState(false);
    const panY = useRef(new Animated.Value(screenHeight)).current;
    
    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0, duration: 200, useNativeDriver: true,
    });
    
    const closeAnim = Animated.timing(panY, {
        toValue: screenHeight/2,
        duration: 400,
        useNativeDriver: true,
    });
    
    const fullScreenAnim = Animated.timing(panY, {
        toValue: -600, // Would move modal to full screen
        duration: 500,
        useNativeDriver: true,
    });
    
    const panResponders = useRef(
      PanResponder.create({
          // Allow pan responder to activate
          onStartShouldSetPanResponder: () => true,
          // Handle card movement while dragging
          onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
          // Handle card release after dragging
          onPanResponderRelease: (e, gs) => {
              if (gs.dy > 0 && gs.vy > 2) {
                  console.log("Swipe down --- Closing drawer")
                  return closeAnim.start(() => onClose());
              } else if (gs.dy < -100) { // Assuming -100 is your threshold for swiping up to go full screen
                  console.log("Starting full screen")
                  return fullScreenAnim.start(() => setFullyOpen(true)); // Transition to full screen
              }
              return resetPositionAnim.start();
          },
      })
    ).current;
    
    useEffect(() => {
        if (isVisible) {resetPositionAnim.start();}
        else {
            closeAnim.start(() => onClose());
        }
    }, [isVisible, closeAnim, resetPositionAnim]);

    return (
        <Modal backdropColor={false} transparent={true} visible={isVisible} style={styles.modal} presentationStyle={'overFullScreen'}>
            <Animated.View style={[styles.drawerContainer, { transform: [{ translateY: panY }] }]}>
                <View style={styles.container}>
                    <TextIconButton
                        style={[styles.button, styles.close_button]}
                        onPress={() => {
                            closeAnim.start(() => onClose())
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
        maxHeight: '60%',
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