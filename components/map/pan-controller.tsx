import React from "react";
import { View, Animated, PanResponder } from "react-native";

class PanController extends React.Component<any, any> {
  _responder: any = null;
  _listener: any = null;
  _direction: any = null;
  _animating: boolean = false;
  _initialTouch: { x: number; y: number } | null = null;
  deceleration: number;

  constructor(props: any) {
    super(props);

    this.deceleration = 0.997;
    if (props.momentumDecayConfig?.deceleration) {
      this.deceleration = props.momentumDecayConfig.deceleration;
    }

    this._responder = PanResponder.create({
      onStartShouldSetPanResponder: (e) => {
        // Store initial touch position
        this._initialTouch = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };

        // Delegate to props handler if exists
        return this.props.onStartShouldSetPanResponder
          ? this.props.onStartShouldSetPanResponder(e)
          : false;
      },

      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (!this._initialTouch) return false;

        // Calculate movement from initial touch
        const moveDistance = Math.sqrt(
          Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
        );

        // Only respond if movement is significant (reduce sensitivity)
        const minDistance = 5; // Increase this value to reduce sensitivity
        const shouldRespond = moveDistance > minDistance;

        // Delegate to props handler if exists
        return this.props.onMoveShouldSetPanResponder
          ? this.props.onMoveShouldSetPanResponder(e, gestureState) &&
              shouldRespond
          : shouldRespond;
      },

      onPanResponderGrant: (...args) => {
        if (this._animating) {
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

      onPanResponderMove: (_, { dx, dy, x0, y0 }) => {
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

        // Determine direction only if not already set
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

        // Handle horizontal movement with strict bounds
        if (horizontal && (!lockDirection || dir === "x")) {
          const [xMin, xMax] = xBounds;
          const currentValue = (panX._value || 0) + (panX._offset || 0);

          // Only allow movement if within bounds or moving back towards bounds
          if (currentValue <= xMax && currentValue >= xMin) {
            this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
          } else if (currentValue > xMax && dx < 0) {
            this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
          } else if (currentValue < xMin && dx > 0) {
            this.handleResponderMove(panX, dx, xMin, xMax, overshootX);
          }
        }

        // Handle vertical movement with strict bounds
        if (vertical && (!lockDirection || dir === "y")) {
          const [yMin, yMax] = yBounds;
          const currentValue = (panY._value || 0) + (panY._offset || 0);

          if (currentValue <= yMax && currentValue >= yMin) {
            this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
          } else if (currentValue > yMax && dy < 0) {
            this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
          } else if (currentValue < yMin && dy > 0) {
            this.handleResponderMove(panY, dy, yMin, yMax, overshootY);
          }
        }
      },

      onPanResponderRelease: (_, { dx, dy, vx, vy }) => {
        this._initialTouch = null;
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
              vx * 1000,
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

        this._direction = null;
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

    // Strict bounds enforcement
    if (val > max) {
      val = overshoot === "spring" ? max + (val - max) / 4 : max;
    }
    if (val < min) {
      val = overshoot === "spring" ? min - (min - val) / 4 : min;
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
      const currentIndex = Math.round(value / snapSpacing);
      const velocityThreshold = 500;

      if (Math.abs(velocity) > velocityThreshold) {
        const direction = Math.sign(velocity);
        const nextIndex = currentIndex + direction;
        // Ensure next index is within bounds
        const maxIndex = Math.floor(max / snapSpacing);
        const minIndex = Math.ceil(min / snapSpacing);
        targetValue =
          Math.max(minIndex, Math.min(maxIndex, nextIndex)) * snapSpacing;
      } else {
        targetValue = currentIndex * snapSpacing;
      }
    }

    // Ensure target is within bounds
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
      // Double-check we're at a valid snap point
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
