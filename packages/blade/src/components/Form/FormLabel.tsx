import React from 'react';
import {
  labelLeftMarginRight,
  labelMarginBottom,
  labelOptionalIndicatorTextSize,
  labelTextSize,
  labelWidth,
} from './formTokens';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { Text } from '~components/Typography';
import { getPlatformType, makeSize, useBreakpoint } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { makeSpace } from '~utils/makeSpace';
import { size as sizeToken } from '~tokens/global';
import getIn from '~utils/lodashButBetter/get';

type CommonProps = {
  as: 'span' | 'label';
  position?: 'top' | 'left';
  necessityIndicator?: 'required' | 'optional' | 'none';
  accessibilityText?: string;
  children: string | undefined;
  id?: string;
  /**
   * Sets the size of the label
   * @default medium
   */
  size?: 'small' | 'medium' | 'large';
  labelSuffix?: React.ReactNode;
  labelTrailing?: React.ReactNode;
};

type LabelProps = CommonProps & {
  htmlFor: string;
  as: 'label';
};

type SpanProps = CommonProps & {
  as: 'span';
  htmlFor?: undefined;
};

type FormLabelProps = LabelProps | SpanProps;

export type FormInputLabelProps = {
  /**
   * Label to be shown for the input field
   */
  label?: string;
  /**
   * Desktop only prop. Default value on mobile will be `top`
   */
  labelPosition?: 'left' | 'top';
  /**
   * Displays `(optional)` when `optional` is passed or `*` when `required` is passed
   */
  necessityIndicator?: 'required' | 'optional' | 'none';

  /**
   * Suffix element to be shown for the input field
   *
   * @example
   * ```jsx
   * labelSuffix={
   *  <Tooltip content="This is a tooltip" placement="right">
   *    <TooltipInteractiveWrapper>
   *        <InfoIcon size="small" color="surface.icon.gray.subtle" />
   *    </TooltipInteractiveWrapper>
   *  </Tooltip>
   * }
   * ```
   */
  labelSuffix?: React.ReactNode;

  /**
   * Trailing element to be shown for the input field
   */
  labelTrailing?: React.ReactNode;
};

const FormLabel = ({
  as = 'span',
  position = 'top',
  necessityIndicator = 'none',
  accessibilityText,
  children,
  id,
  htmlFor,
  size = 'medium',
  labelSuffix,
  labelTrailing,
}: FormLabelProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isDesktop = matchedDeviceType === 'desktop';
  const isReactNative = getPlatformType() === 'react-native';

  let necessityLabel: React.ReactNode = null;

  const isLabelLeftPositioned = position === 'left' && isDesktop;

  if (necessityIndicator === 'optional') {
    necessityLabel = (
      <Text
        variant="caption"
        size={labelOptionalIndicatorTextSize[size]}
        color="surface.text.gray.muted"
      >
        (optional)
      </Text>
    );
  }
  if (necessityIndicator === 'required') {
    necessityLabel = (
      <Text
        variant="body"
        size={isLabelLeftPositioned ? 'medium' : 'small'}
        color="feedback.text.negative.intense"
        alignSelf="flex-start"
      >
        *
      </Text>
    );
  }

  const computedAccessibilityNode = (
    <VisuallyHidden>
      {necessityIndicator !== 'none' && <Text>{necessityIndicator}</Text>}
      <Text>{accessibilityText}</Text>
    </VisuallyHidden>
  );

  const textNode = (
    <BaseBox
      gap={necessityIndicator === 'optional' ? 'spacing.2' : 'spacing.0'}
      display="flex"
      flexDirection="row"
      alignItems="center"
      // flexWrap="wrap"
      maxHeight={makeSpace(sizeToken[36])}
    >
      <Text
        variant="body"
        size={labelTextSize[isLabelLeftPositioned ? 'left' : 'top'][size]}
        color={isLabelLeftPositioned ? 'surface.text.gray.subtle' : 'surface.text.gray.muted'}
        truncateAfterLines={2}
        weight="semibold"
        wordBreak={isLabelLeftPositioned ? 'break-word' : undefined}
      >
        {children}
      </Text>
      {computedAccessibilityNode}
      {/* TODO: Hide from screen readers to prevent double announcement */}
      {necessityLabel}
    </BaseBox>
  );

  // What harm can it do?
  if (isReactNative) {
    return (
      <BaseBox marginRight="spacing.5" marginBottom="spacing.2">
        {textNode}
      </BaseBox>
    );
  }

  const Component = as;
  // only set 120px label when device is desktop
  const width = isLabelLeftPositioned && isDesktop ? makeSize(labelWidth[size]) : '100%';

  return (
    <Component
      htmlFor={htmlFor}
      style={{
        width,
        flexShrink: 0,
        marginRight: isLabelLeftPositioned
          ? makeSpace(getIn(theme, labelLeftMarginRight[size]))
          : makeSpace(getIn(theme, 'spacing.0')),
      }}
      id={id}
      {...metaAttribute({ name: MetaConstants.FormLabel })}
    >
      <BaseBox
        width="100%"
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'column' : 'row'}
        alignItems={isLabelLeftPositioned ? 'flex-start' : 'center'}
        marginBottom={isLabelLeftPositioned ? 'spacing.0' : labelMarginBottom[size]}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
          <BaseBox>{textNode}</BaseBox>
          {labelSuffix ? <BaseBox display="flex">{labelSuffix}</BaseBox> : null}
        </BaseBox>
        {labelTrailing ? (
          <BaseBox marginLeft={isLabelLeftPositioned ? 'spacing.0' : 'auto'}>
            {labelTrailing}
          </BaseBox>
        ) : null}
      </BaseBox>
    </Component>
  );
};

export { FormLabel };
