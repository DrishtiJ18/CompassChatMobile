import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Animated, Easing, View} from 'react-native';

/**
 * React Component that creates a smooth loading animation with dots
 * or custom components
 * @param {number} dots
 * @param {number} size
 * @param {number} bounceHeight
 * @param {number} borderRadius
 * @returns React.JSX.Element
 */
interface GeneratingAnimationPropType {
  dots?: number;
  size?: number;
  bounceHeight?: number;
  borderRadius?: number;
  show: boolean;
  animationfDirection?: string;
}

function GeneratingAnimation({
  dots = 3,
  size = 7,
  bounceHeight = 5,
  borderRadius,
  show = false,
  animationfDirection = 'flex-row',
}: GeneratingAnimationPropType) {
  const [animations, setAnimations] = useState([]);
  const [reverse, setReverse] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dotAnimations = [];
    let animationsAmount = dots;
    for (let i = 0; i < animationsAmount; i++) {
      dotAnimations.push(new Animated.Value(0));
    }
    setAnimations(dotAnimations);
  }, []);

  useEffect(() => {
    if (animations.length === 0) return;
    loadingAnimation(animations, reverse);
    appearAnimation();
  }, [animations]);

  function appearAnimation() {
    Animated.timing(opacity, {
      toValue: 1,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function floatAnimation(node, reverseY, delay) {
    const floatSequence = Animated.sequence([
      Animated.timing(node, {
        toValue: reverseY ? bounceHeight : -bounceHeight,
        easing: Easing.bezier(0.41, -0.15, 0.56, 1.21),
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(node, {
        toValue: reverseY ? -bounceHeight : bounceHeight,
        easing: Easing.bezier(0.41, -0.15, 0.56, 1.21),
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(node, {
        toValue: 0,
        delay,
        useNativeDriver: true,
      }),
    ]);
    return floatSequence;
  }

  function loadingAnimation(nodes, reverseY) {
    Animated.parallel(
      nodes.map((node, index) => floatAnimation(node, reverseY, index * 100)),
    ).start(() => {
      setReverse(!reverse);
    });
  }

  useEffect(() => {
    if (animations.length === 0) return;
    loadingAnimation(animations, reverse);
  }, [reverse, animations]);

  return show ? (
    <View
      className={`w-full flex ${animationfDirection}`}
      testID="three-dots-generating-view">
      <View className="ml-1 border border-slate-300 bg-white h-9 w-14 rounded-2xl flex items-center justify-center">
        <Animated.View
          style={[styles.loading, {opacity}]}
          testID="three-dots-animation-view">
          {animations.map((animation, index) => (
            <Animated.View
              key={`loading-anim-${index}`}
              testID={`dot-${index}-animation-view`}
              style={[
                {
                  width: size,
                  height: size,
                  borderRadius: borderRadius || size / 2,
                  marginRight: 6,
                },
                {backgroundColor: '#00D2AA'},
                {transform: [{translateY: animation}]},
              ]}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
    marginLeft: 35,
  },
});

export default GeneratingAnimation;
