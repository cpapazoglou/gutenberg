/**
 * External dependencies
 */
import Clipboard from 'clipboard';

/**
 * WordPress dependencies
 */
import { useRef, useEffect, useState } from '@wordpress/element';

/**
 * Copies the text to the clipboard when the element is clicked.
 *
 * @param {import('react').MutableRefObject<Element>} ref     Reference with the element.
 * @param {string|Function}                        text    The text to copy.
 * @param {number}                                 timeout Optional timeout to reset the returned
 *                                                         state. 4 seconds by default.
 *
 * @return {boolean} Whether or not the text has been copied. Resets after the
 *                   timeout.
 */
export default function useCopyOnClick( ref, text, timeout = 4000 ) {
	/** @type {import('react').MutableRefObject<ClipboardJS|undefined>} */
	const clipboard = useRef();
	const [ hasCopied, setHasCopied ] = useState( false );

	useEffect( () => {
		/** @type {number|undefined} */
		let timeoutId;

		// Clipboard listens to click events.
		clipboard.current = new Clipboard( ref.current, {
			text: () => ( typeof text === 'function' ? text() : text ),
			container: ref.current,
		} );

		/** @type {ClipboardJS} */ ( clipboard.current ).on(
			'success',
			( { clearSelection } ) => {
				// Clearing selection will move focus back to the triggering button,
				// ensuring that it is not reset to the body, and further that it is
				// kept within the rendered node.
				clearSelection();

				if ( timeout ) {
					setHasCopied( true );
					clearTimeout( timeoutId );
					timeoutId = setTimeout(
						() => setHasCopied( false ),
						timeout
					);
				}
			}
		);

		return () => {
			// eslint-disable-next-line no-unused-expressions
			clipboard.current?.destroy();
			clearTimeout( timeoutId );
		};
	}, [ text, timeout, setHasCopied ] );

	return hasCopied;
}

/** @typedef {import('clipboard')} ClipboardJS */