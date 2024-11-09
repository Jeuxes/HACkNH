import * as React from 'react';
import {
    View, Text, Button, Image, TouchableOpacity, Animated,
    PanResponder, Dimensions, StyleSheet, ScrollView, FlatList, Alert, Pressable
} from 'react-native';
import Modal from 'react-native-modal';
import * as styles_ from "../styles";
import TextIconButton from "./TextIconButton";
// import Category from "./Category";
// import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
// import {Rating} from "react-native-elements";
// import {CardItemHandle, TinderCard} from "rn-tinder-card";
// import {GestureHandlerRootView} from "react-native-gesture-handler";

const screenHeight = Dimensions.get('window').height;

// const Sports_Icon_List = [
//     <Image source={require('../assets/images/icons/all_sports.png')} style={{height: 16, width: 16}} />,
//     <Ionicons name="football-outline" size={16}/>,
//     <MaterialCommunityIcons name="basketball" size={16}/>,
//     <MaterialCommunityIcons name="cricket" size={16}/>,
//     <MaterialCommunityIcons name="hockey-sticks" size={16}/>, // TODO TEMPORARY FOR NOW
//     <MaterialCommunityIcons name="tennis" size={16}/>,
//     <MaterialCommunityIcons name="volleyball" size={16}/>,
//     <MaterialCommunityIcons name="table-tennis" size={16}/>,
//     <MaterialCommunityIcons name="baseball" size={16}/>,
//     <MaterialCommunityIcons name="golf-tee" size={16}/>, // TODO Could change to just 'golf', depends on image
//     <MaterialCommunityIcons name="rugby" size={16}/>,
//     <MaterialCommunityIcons name="swim" size={16}/>,
//     <Image source={require('../assets/images/icons/all_sports.png')} style={{height: 16, width: 16}} />, //TODO temporary ATHLETICS for now
//     <MaterialCommunityIcons name="badminton" size={16}/>,
//     <MaterialCommunityIcons name="table-tennis" size={16}/>, // TODO fix for squash icon later
//     <MaterialCommunityIcons name="hockey-sticks" size={16}/>,
//     <MaterialCommunityIcons name="water-polo" size={16}/>,
//     <MaterialCommunityIcons name="bike-fast" size={16}/>,
//     <MaterialCommunityIcons name="human-handsdown" size={16}/>, // TODO fix for wrestling
//     <MaterialCommunityIcons name="sail-boat" size={16}/>,
//     <MaterialCommunityIcons name="human-handsdown" size={16}/>, // TODO fix for MMA
//     <Ionicons name="football-outline" size={16}/>,
//     <MaterialCommunityIcons name="snowboard" size={16}/>,
//     <MaterialCommunityIcons name="ski" size={16}/>,
//     // <MaterialCommunityIcons name="rowing" size={16}/>,
// ]
//
// const gender_list = [
//     <MaterialCommunityIcons name="human-male" size={16}/>,
//     <MaterialCommunityIcons name="human-female" size={16}/>,
//     <MaterialCommunityIcons name="human-male-female" size={16}/>, // For Co-Ed
// ]
//
// const group_size_icon = <MaterialCommunityIcons name="human-queue" size={16}/>

const TabImage = (props) => (
    <View style={{height: 300, width: 300, marginLeft: 15, borderWidth: 0.5, borderRadius: 30, borderColor: styles_.GRAY}}>
        <View style={{flex: 2}}>
            {props.imageUri !== ''? (
                <Image source={props.imageUri}
                       style={{flex: 1, width: null, height: null, resizeMode: 'cover', borderRadius: 30,}}
                />
            ): (
                <Image style={{flex: 1, width: null, height: null, resizeMode: 'cover', borderRadius: 30,}}
                />
            )}
        </View>
    </View>
);

const BottomGroupDrawer = React.forwardRef(({ navigation, setVisible, isVisible, group_info, onClose, }, ref) => {
    const [isFullyOpen, setFullyOpen] = React.useState(false);
    const panY = React.useRef(new Animated.Value(screenHeight)).current;
    const tinderCardsRef = React.useRef<Array<CardItemHandle | null>>([]);

    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0, duration: 100, useNativeDriver: true,
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

    const panResponders = React.useRef(
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


    React.useEffect(() => {
        if (isVisible) {resetPositionAnim.start();}
        else {closeAnim.start();}
    }, [isVisible, closeAnim, resetPositionAnim]);

    if (group_info == null) {return <></>}
    let group_posts = group_info.posts;

    const bottomDrawerItem = ({ item, index }) => {
        if (index === 0) {
            return (<Category key={index} imageUri={item.image} isLarge/>)
        } else {
            return (<Category key={index} imageUri={item.image}/>);
        }
    };

    const renderItem = ({ item, index }) => {
        if (index === 0) {
            return (<TabImage key={index} imageUri={item.image} isLarge/>)
        } else {
            return (<TabImage key={index} imageUri={item.image}/>);
        }
    };

    if (group_info.posts.length < 6) {
        console.log(group_info.posts)
        for (let i = group_info.posts.length; i < 6; i++) {
            console.log(i)
            group_posts.push({id: i+1, content: '', image: ''});
        }
    }

    const OverlayRight = () => {
        return (
            <View style={[card_styles.overlayLabelContainer, {backgroundColor: 'green',},]}>
                <Text style={card_styles.overlayLabelText}>Like</Text>
            </View>
        );
    };
    const OverlayLeft = () => {
        return (
            <View style={[card_styles.overlayLabelContainer, {backgroundColor: 'red',},]}>
                <Text style={card_styles.overlayLabelText}>Nope</Text>
            </View>
        );
    };
    const OverlayBottom = () => {
        return (
            <View
                style={[card_styles.overlayLabelContainer, {backgroundColor: 'gray',},]}>
                <Text style={card_styles.overlayLabelText}>Cancel</Text>
            </View>
        );
    };

    const display_tags = [
        {str: 'sports_type', title: group_info.sportType.str, icon: Sports_Icon_List[group_info.sportType.num],},
        {str: 'group_size', title: "Size: " + group_info.size, icon: group_size_icon,},
        {str: 'group_gender', title: group_info.tags.gender.str, icon: gender_list[group_info.tags.gender.num],},
    ]

    return (isFullyOpen)?
        (
            <GestureHandlerRootView style={{...card_styles.wrapper, ...styles.swipe_modal}}>
                <View key={0} style={card_styles.cardContainer} pointerEvents="box-none">
                    <TinderCard
                        ref={(el) => (tinderCardsRef.current = el)}
                        cardWidth={'92%'}
                        cardHeight={screenHeight*0.75}
                        disableTopSwipe={true}
                        OverlayLabelRight={OverlayRight}
                        OverlayLabelLeft={OverlayLeft}
                        OverlayLabelBottom={OverlayBottom}
                        cardStyle={card_styles.card}
                        onSwipedRight={() => {
                            Alert.alert('Accepted')
                            setFullyOpen(false)
                            navigation.navigate('screens/GroupDashboard', {group_info: group_info})
                        }}
                        onSwipedLeft={() => {
                            Alert.alert('Declined')
                            setFullyOpen(false)
                            closeAnim.start(() => onClose())
                        }}
                        onSwipedBottom={() => {
                            setFullyOpen(false)
                        }}
                    >
                        <View>
                            <View style={{alignItems: "center"}}>
                                <Header style={{...styles.tab_group_name}} >{group_info.name}</Header>
                            </View>
                            <View style={{flexDirection: "column",alignItems: "center",}}>
                                <Rating fractions="{0}" startingValue={group_info.rating} readonly imageSize={16}/>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                            {display_tags.map(tag => {
                                return (
                                    <TextIconButton
                                        key={tag.str}
                                        style={[styles.center,styles.button,styles.sports_filter_button,]}
                                        textStyle={{...styles.desc,}}
                                        title={tag.title}
                                        icon={tag.icon}
                                    />
                                )
                            })}
                        </View>
                        <View style={{justifyContent: 'space-evenly', alignItems: 'center',}}>
                            <Text style={[styles.bigger_desc]}>{group_info.description}</Text>
                        </View>
                        <View style={{alignItems: "left", marginLeft: 25}}>
                            <Header style={{...styles.group_name, marginBottom: 0,}} >Recent Posts</Header>
                        </View>
                        <View style={{padding: 10, height: 320}}>
                            <FlatList
                                data={group_info.posts}
                                renderItem={renderItem}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{width: '100%'}}
                            />
                        </View>
                        <View style={{top: 20, flexDirection: "row", justifyContent: 'space-evenly'}}>
                            <View style={{flexDirection: "column",alignItems: "center", flexWrap: 'wrap'}}>
                                <Text>Swipe Left to Decline</Text>
                            </View>
                            <View style={{flexDirection: "column",alignItems: "center", flexWrap: 'wrap'}}>
                                <Text>Swipe Right to Join!</Text>
                            </View>
                        </View>
                        <View style={{top: 40, alignItems: 'center'}}>
                            <Text>Swipe Down to Cancel</Text>
                        </View>
                    </TinderCard>
                </View>
            </GestureHandlerRootView>
        ) :(
            <Modal isVisible={isVisible} hasBackdrop={false} coverScreen={false} style={styles.modal} presentationStyle={'overFullScreen'}>
                <Animated.View
                    style={[styles.drawerContainer, { transform: [{ translateY: panY }]},]} {...panResponders.panHandlers}>
                    <View style={styles.container}>
                        <Animated.View style={{flexDirection: "row"}} {...panResponders.panHandlers}>
                            <TextIconButton
                                style={[styles.button, styles.close_button]}
                                onPress={() => {
                                    closeAnim.start(() => onClose())
                                }}
                                icon={<Ionicons name="close-outline" color={styles_.DARK_GRAY} size={28}/>}
                            />
                            <View style={styles.horizontalBar} />
                        </Animated.View>
                        <ScrollView scrollEventThrottle={10}>
                            <FlatList
                                data={group_posts}
                                renderItem={bottomDrawerItem}
                                horizontal={true}
                                contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center'}}
                                showsHorizontalScrollIndicator={false}
                                style={{width: '100%', height: 125}}
                            />
                            <View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                    <View style={{flexDirection: "column",alignItems: "left",width: '50%', flex: 1}}>
                                        <Header style={{...styles.group_name}} >{group_info.name}</Header>
                                    </View>
                                    <View style={{flexDirection: "column",alignItems: "center",}}>
                                        <Rating fractions="{0}" startingValue={group_info.rating} readonly imageSize={16}/>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.desc]}>{group_info.description}</Text>
                            <View style={{flexDirection: "row",}}>
                                <View style={{flexDirection: "column",alignItems: "center",}}>
                                    <TextIconButton style={[styles.center, styles.button, styles.sports_filter_button]}
                                                    textStyle={{...styles.desc, marginLeft: 5,}}
                                                    title={group_info.sportType.str}
                                                    icon={
                                                        Sports_Icon_List[group_info.sportType.num]
                                                    } />
                                </View>
                                <View style={{flexDirection: "column",alignItems: "center",}}>
                                    <TextIconButton style={[styles.center, styles.button, styles.sports_filter_button]}
                                                    textStyle={{...styles.desc, marginLeft: 5,}}
                                                    title={"Size: "+group_info.size}
                                                    icon={group_size_icon} />
                                </View>
                                <View style={{flexDirection: "column",alignItems: "center",}}>
                                    <TextIconButton style={[styles.center, styles.button, styles.sports_filter_button]}
                                                    textStyle={{...styles.desc, marginLeft: 5,}}
                                                    title={group_info.tags.gender.str}
                                                    icon={gender_list[group_info.tags.gender.num]} />
                                </View>
                            </View>
                        </ScrollView>
                        <View style={{ height: screenHeight }} />
                    </View>
                </Animated.View>
            </Modal>
        );
});

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        top: screenHeight-40, // Hard coded fix to modal filling entire screen
    },
    swipe_modal: {
        justifyContent: 'flex-end',
        margin: 0,
        left: '2%',
        width: '96%',
        top: 400,
        maxHeight: '100%',
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
        borderRadius: 20,
        maxHeight: '100%',
    },
    horizontalBar: {
        width: 120,
        height: 6,
        borderRadius: 2.5,
        backgroundColor: '#ccc',
        marginBottom: 30,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: 'center',
        marginLeft: '15%',
    },
    button: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 40, marginTop: 15, height: 55, marginHorizontal: 10, elevation: 5,
    },
    close_button: {
        top: -20, left: -15,
        width: 40, height: 40, borderColor: 'transparent',
    },
    sports_filter_button: {
        width: 'auto', height: 40, padding: 10,
        borderRadius: 30, marginHorizontal: 0,
    },
    roundedButton: {
        width: 40, height: 40,
    },
    tab_group_name: {
        fontSize: 30, fontWeight: '600', textAlign: 'left',
        marginTop: 10, marginBottom: 10,
    },
    group_name: {
        fontSize: 24, fontWeight: '700', textAlign: 'left',
        marginTop: 10, marginBottom: 10, paddingRight: 20,
    },
    desc: {
        color: styles_.GRAY,
    },
    bigger_desc: {
        color: styles_.GRAY,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginHorizontal: 10,
    }
});

const card_styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
    },
    cardContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 48,
        position: 'relative',
        backgroundColor: 'white',
    },
    buttonContainer: {
        bottom: 64,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 100,
    },
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderRadius: 48
    },
    overlayLabelContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayLabelText: { color: 'white', fontSize: 42, fontWeight: 'bold', textAlign: 'center' },
    buttonLabelText: { color: 'black', fontSize: 32, fontWeight: 'bold', textAlign: 'center'  },
    button: {
        borderRadius: 80,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomGroupDrawer;