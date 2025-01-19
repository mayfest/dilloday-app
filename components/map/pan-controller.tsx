import React from "react";
import { View, Animated, PanResponder } from "react-native";

class PanController extends React.Component<any, any> {
  _responder: any = null;
  _listener: any = null;
  _direction: any = null;
  _animating: boolean = false;
  deceleration: number;

  constructor(props: any) {
    super(props);

    this.deceleration = 0.997;
    if (props.momentumDecayConfig?.deceleration) {
      this.deceleration = props.momentumDecayConfig.deceleration;
    }

    this._responder = PanResponder.create({
      onStartShouldSetPanResponder: this.props.onStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.props.onMoveShouldSetPanResponder,

      onPanResponderGrant: (...args) => {
        if (this._animating) {
          // Stop any ongoing animations when user touches
          const { panX, panY } = this.props;
          panX && panX.stopAnimation();
          panY && panY.stopAnimation();
          this._animating = false;
        }

        if (this.props.onPanResponderGrant) {
          this.props.onPanResponderGrant(...args);
        }

        const { panX, panY, horizontal, vertical, xMode, yMode } = this.props;

        this.handleResponderGrant(panX, xMode);
        this.handleResponderGrant(panY, yMode);

        this._direction =
          horizontal && !vertical ? "x" : vertical && !horizontal ? "y" : null;
      },

      onPanResponderMove: (_, { dx, dy, x0, y0, moveX, moveY }) => {
        const {
          panX,
          panY,
          xBounds,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          directionLockDistance,
        } = this.props;

        if (!this._direction && (horizontal || vertical)) {
          const dx2 = dx * dx;
          const dy2 = dy * dy;
          if (dx2 + dy2 > directionLockDistance) {
            this._direction = dx2 > dy2 ? "x" : "y";
            if (this.props.onDirectionChange) {
              this.props.onDirectionChange(this._direction, { dx, dy, x0, y0 });
            }
          }
        }

        const dir = this._direction;

        if (this.props.onPanResponderMove) {
          this.props.onPanResponderMove(_, { dx, dy, x0, y0 });
        }

        if (horizontal && (!lockDirection || dir === "x")) {
          const [xMin, xMax] = xBounds;
          this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
        }

        if (vertical && (!lockDirection || dir === "y")) {
          const [yMin, yMax] = yBounds;
          this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
        }
      },

      onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
        const {
          panX,
          panY,
          xBounds,
          yBounds,
          overshootX,
          overshootY,
          horizontal,
          vertical,
          lockDirection,
          xMode,
          yMode,
          snapSpacingX,
          snapSpacingY,
        } = this.props;

        const dir = this._direction;
        let cancel = false;

        if (this.props.onRelease) {
          cancel = this.props.onRelease({ vx, vy, dx, dy }) === false;
        }

        if (!cancel && horizontal && (!lockDirection || dir === "x")) {
          const [xMin, xMax] = xBounds;
          if (this.props.onReleaseX) {
            cancel = this.props.onReleaseX({ vx, vy, dx, dy }) === false;
          }
          !cancel &&
            this.handleResponderRelease(
              panX,
              xMin,
              xMax,
              vx * 1000, // Convert to pixels per second
              overshootX,
              xMode,
              snapSpacingX
            );
        }

        if (!cancel && vertical && (!lockDirection || dir === "y")) {
          const [yMin, yMax] = yBounds;
          if (this.props.onReleaseY) {
            cancel = this.props.onReleaseY({ vx, vy, dx, dy }) === false;
          }
          !cancel &&
            this.handleResponderRelease(
              panY,
              yMin,
              yMax,
              vy * 1000,
              overshootY,
              yMode,
              snapSpacingY
            );
        }

        this._direction =
          horizontal && !vertical ? "x" : vertical && !horizontal ? "y" : null;
      },
    });
  }

  handleResponderMove(
    anim: any,
    delta: any,
    min: any,
    max: any,
    overshoot: any
  ) {
    let val = anim._offset + delta;

    // Enforce stricter bounds checking
    if (val > max) {
      switch (overshoot) {
        case "spring":
          val = max + (val - max) / 3;
          break;
        case "clamp":
        default:
          val = max;
          break;
      }
    }
    if (val < min) {
      switch (overshoot) {
        case "spring":
          val = min - (min - val) / 3;
          break;
        case "clamp":
        default:
          val = min;
          break;
      }
    }

    val = val - anim._offset;
    anim.setValue(val);
  }

  handleResponderRelease(
    anim: any,
    min: any,
    max: any,
    velocity: any,
    overshoot: any,
    mode: any,
    snapSpacing: any
  ) {
    anim.flattenOffset();
    let value = anim._value;
    let targetValue = value;

    if (mode === "snap" && snapSpacing) {
      // Calculate nearest snap point
      const currentIndex = Math.round(value / snapSpacing);
      const velocityThreshold = 500; // pixels per second

      if (Math.abs(velocity) > velocityThreshold) {
        // If velocity is high enough, move to next/previous snap point
        const direction = Math.sign(velocity);
        targetValue = (currentIndex + direction) * snapSpacing;
      } else {
        // Otherwise snap to nearest point
        targetValue = currentIndex * snapSpacing;
      }
    }

    // Ensure we stay within bounds
    targetValue = Math.max(min, Math.min(max, targetValue));

    this._animating = true;
    Animated.spring(anim, {
      toValue: targetValue,
      velocity: velocity,
      tension: 65,
      friction: 10,
      useNativeDriver: false,
    }).start(() => {
      this._animating = false;
      // Ensure we ended up at a valid snap point
      if (mode === "snap" && snapSpacing) {
        const finalValue = anim._value;
        const nearestSnap = Math.round(finalValue / snapSpacing) * snapSpacing;
        if (Math.abs(finalValue - nearestSnap) > 0.1) {
          this.handleResponderRelease(
            anim,
            min,
            max,
            0,
            overshoot,
            mode,
            snapSpacing
          );
        }
      }
    });
  }

  handleResponderGrant(anim: any, mode: any) {
    switch (mode) {
      case "spring-origin":
        anim.setValue(0);
        break;
      case "snap":
      case "decay":
        anim.setOffset(anim._value + anim._offset);
        anim.setValue(0);
        break;
    }
  }

  render() {
    return <View {...this.props} {...this._responder.panHandlers} />;
  }

  componentWillUnmount() {
    const { panX, panY } = this.props;
    if (panX) panX.stopAnimation();
    if (panY) panY.stopAnimation();

    if (this._listener) {
      if (panX) panX.removeListener(this._listener);
      if (panY) panY.removeListener(this._listener);
    }
  }
}

export default PanController;
