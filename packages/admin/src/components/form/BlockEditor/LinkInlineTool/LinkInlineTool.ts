import SelectionUtils from './selection'

interface IContainers {
  inputContainer: HTMLDivElement
  titleContainer: HTMLDivElement
  targetContainer: HTMLDivElement
}

interface IInputs {
  input: HTMLInputElement
  title: HTMLInputElement
  target: HTMLInputElement
}

interface INodes extends IContainers, IInputs {
  button: HTMLButtonElement
  buttonSubmit: HTMLButtonElement
  actionContainer: HTMLDivElement
}

type AllowedNodes = keyof IInputs

const ELEMENTS: {
  type: 'input'
  name: AllowedNodes
  label: string
  description?: string
  props: {
    placeholder?: string
    type?: string
  }
}[] = [
  {
    type: 'input',
    name: 'input',
    label: 'URL',
    props: {
      placeholder: 'URL',
    },
  },
  {
    type: 'input',
    name: 'title',
    label: 'Title',
    props: {
      placeholder: 'Title',
    },
  },
  {
    type: 'input',
    name: 'target',
    label: 'Target',
    description: 'Open in new Window',
    props: {
      type: 'checkbox',
    },
  },
]

/**
 * Link Tool (Inline Toolbar Tool), wraps selected text with <a> tag
 *
 * Mainly inspired by EditorJS', but extended with own features like:
 * - target setting
 * - alternative text and title attribute
 * @see https://github.com/codex-team/editor.js/blob/737ba2abb423665257cf6ccc5e8472742433322f/src/components/inline-tools/inline-tool-link.ts
 */
export class LinkInlineTool implements EditorJS.InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  public static isInline = true

  /**
   * Title for hover-tooltip
   */
  public static title = 'Link'

  /**
   * Set a shortcut
   */
  public get shortcut(): string {
    return 'CMD+K'
  }

  /**
   * Sanitizer Rule
   * Leave <a> tags
   * @return {object}
   */
  static get sanitize(): EditorJS.SanitizerConfig {
    return {
      a: {
        href: true,
        rel: 'nofollow',
        target: '_blank',
        title: true,
      },
    }
  }

  /**
   * Native Document's commands for insertHTML and unlink
   * @see https://stackoverflow.com/a/23891233/1238150
   */
  private readonly commandLink: string = 'insertHTML'

  private readonly commandUnlink: string = 'unlink'

  /**
   * Enter key code
   */
  private readonly ENTER_KEY = 13 as const

  /**
   * Styles
   */
  private CSS: {
    button: string
    buttonActive: string
    input: string
    inputShowed: string
  }

  /**
   * Elements
   */
  private nodes: INodes = {
    actionContainer: null,
    button: null,
    buttonSubmit: null,
    input: null,
    inputContainer: null,
    title: null,
    titleContainer: null,
    target: null,
    targetContainer: null,
  } as any

  /**
   * SelectionUtils instance
   */
  private selection: SelectionUtils

  private apiSelection: EditorJS.API['selection']

  /**
   * Input opening state
   */
  private inputOpened = false

  /**
   * Available Toolbar methods (open/close)
   */
  private toolbar: any

  /**
   * Available inline toolbar methods (open/close)
   */
  private inlineToolbar: any

  /**
   * Notifier API methods
   */
  private notifier: any

  /**
   * @param {{api: API}} - Editor.js API
   */
  constructor({ api }: { api: EditorJS.API }) {
    this.toolbar = api.toolbar
    this.inlineToolbar = api.inlineToolbar
    this.notifier = api.notifier
    this.apiSelection = api.selection
    this.selection = new SelectionUtils()

    /**
     * CSS classes
     */
    this.CSS = {
      button: api.styles.inlineToolButton,
      buttonActive: api.styles.inlineToolButtonActive,
      input: 'ce-inline-tool-input',
      inputShowed: 'ce-inline-tool-input--showed',
    }
  }

  /**
   * Create button for Inline Toolbar
   */
  public render(): HTMLElement {
    this.nodes.button = document.createElement('button') as HTMLButtonElement
    this.nodes.button.type = 'button'
    this.nodes.button.classList.add(this.CSS.button)
    this.nodes.button.innerHTML = `<svg class="icon icon--link" width="14px" height="10px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#link"></use></svg>`
    return this.nodes.button
  }

  /**
   * Input for the link edit view
   *
   * the DOM structure for each input looks like this:
   *
   * ```
   * <div class="ce-inline-link-tool">
   *  <div class="ce-inline-tool-container">
   *    <label>
   *      <span>Label</span>
   *      <input />
   *      <span>Description</span> // optional
   *    </label>
   *  </div>
   *  // ... other link inputs
   *  <button />
   * </div>
   * ```
   */
  public renderActions(): HTMLElement {
    // Container holds all elements of the Inline Tool Actions
    this.nodes.actionContainer = document.createElement('div')
    this.nodes.actionContainer.classList.add('ce-inline-link-tool')
    this.nodes.actionContainer.classList.add(this.CSS.input)

    // the submit button applies the inline-tool styling to the selected text
    this.nodes.buttonSubmit = document.createElement('button')
    this.nodes.buttonSubmit.innerText = 'OK'
    this.nodes.buttonSubmit.onclick = this.dataEntered.bind(this)

    // renders each input container (eg. url, href, target)
    ELEMENTS.forEach((element) => {
      // wrap each element with a container and a label for better UI/UX
      const containerName = `${element.name}Container` as keyof IContainers
      this.nodes[containerName] = document.createElement('div')
      this.nodes[containerName].classList.add('ce-inline-tool-container')
      const label = document.createElement('label')
      label.innerHTML = `<span>${element.label}</span>`

      // the element itself, with special treatment of checkbox elements
      this.nodes[element.name] = document.createElement(element.type)
      Object.keys(element.props).forEach((key) => {
        this.nodes[element.name][key] = element.props[key]

        if (element.props.type === 'checkbox') {
          this.nodes[element.name].checked = true
        }
      })

      this.nodes[element.name].addEventListener(
        'keydown',
        (event: KeyboardEvent) => {
          // prevent the default action of the ENTER_KEY or the inline-tool will
          // close
          if (event.keyCode === this.ENTER_KEY) {
            event.preventDefault()
          }
        }
      )

      // DOM: Container -> Label -> Input (+ Description)
      label.appendChild(this.nodes[element.name])

      if (element.description) {
        const description = document.createElement('span')
        description.innerText = element.description
        label.appendChild(description)
      }

      this.nodes[containerName].appendChild(label)
      this.nodes.actionContainer.appendChild(this.nodes[containerName])
    })

    this.nodes.actionContainer.appendChild(this.nodes.buttonSubmit)
    return this.nodes.actionContainer
  }

  /**
   * Handle clicks on the Inline Toolbar icon
   * @param {Range} range
   */
  public surround(range: Range): void {
    /**
     * Range will be null when user makes second click on the 'link icon' to close opened input
     */
    if (range) {
      /**
       * Save selection before change focus to the input
       */
      if (!this.inputOpened) {
        /** Create blue background instead of selection */
        this.selection.setFakeBackground()
        this.selection.save()
      } else {
        this.selection.restore()
        this.selection.removeFakeBackground()
      }
      const parentAnchor = this.apiSelection.findParentTag('A')

      /**
       * Unlink icon pressed
       */
      if (parentAnchor) {
        this.apiSelection.expandToTag(parentAnchor)
        this.unlink()
        this.closeActions()
        this.checkState()
        this.toolbar.close()
        return
      }
    }

    this.toggleActions()
  }

  /**
   * Check selection and set activated state to button if there are <a> tag
   * @param {Selection} selection
   */
  public checkState(): boolean {
    const anchorTag = this.apiSelection.findParentTag('A')

    if (anchorTag) {
      this.nodes.button.classList.add(this.CSS.buttonActive)
      this.openActions()

      /**
       * Fill input values
       */
      const hrefAttr = anchorTag.getAttribute('href')
      const titleAttr = anchorTag.getAttribute('title')
      const targetAttr = anchorTag.getAttribute('target')
      this.nodes.input.value = hrefAttr || ''
      this.nodes.title.value = titleAttr || ''
      this.nodes.target.checked = targetAttr === '_blank'

      // save the current selection, because the editor will loose its selection
      // during editing links. The selection will be restored later again.
      this.selection.save()
    } else {
      this.nodes.button.classList.remove(this.CSS.buttonActive)
    }

    return !!anchorTag
  }

  /**
   * Function called with Inline Toolbar closing
   */
  public clear(): void {
    this.closeActions()
  }

  private toggleActions(): void {
    if (!this.inputOpened) {
      this.openActions(true)
    } else {
      this.closeActions(false)
    }
  }

  /**
   * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
   */
  private openActions(needFocus = false): void {
    this.nodes.actionContainer.classList.add(this.CSS.inputShowed)
    if (needFocus) {
      this.nodes.input.focus()
    }
    this.inputOpened = true
  }

  /**
   * Close input
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  private closeActions(clearSavedSelection = true): void {
    if (this.selection.isFakeBackgroundEnabled) {
      // if actions is broken by other selection We need to save new selection
      const currentSelection = new SelectionUtils()
      currentSelection.save()

      this.selection.restore()
      this.selection.removeFakeBackground()

      // and recover new selection after removing fake background
      currentSelection.restore()
    }

    // reset stylings and values
    this.nodes.actionContainer.classList.remove(this.CSS.inputShowed)
    this.nodes.input.value = ''
    this.nodes.title.value = ''
    this.nodes.target.checked = true
    if (clearSavedSelection) {
      this.selection.clearSaved()
    }
    this.inputOpened = false
  }

  /**
   * Submit button pressed
   */
  private dataEntered(event: MouseEvent): void {
    let value = this.nodes.input.value || ''

    if (!value.trim()) {
      this.selection.restore()
      this.unlink()
      event.preventDefault()
      this.closeActions()
    }

    if (!this.validateURL(value)) {
      this.notifier.show({
        message: 'Pasted link is not valid.',
        style: 'error',
      })
      return
    }

    value = this.prepareLink(value)

    this.selection.restore()
    this.selection.removeFakeBackground()

    this.insertLink(value)

    /**
     * Preventing events that will be able to happen
     */
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
    this.selection.collapseToEnd()
    this.inlineToolbar.close()
  }

  /**
   * Detects if passed string is URL
   * @param  {string}  str
   * @return {Boolean}
   */
  private validateURL(str: string): boolean {
    /**
     * Don't allow spaces
     */
    return !/\s/.test(str)
  }

  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   * @param {string} link - raw user input
   */
  private prepareLink(link: string): string {
    let newLink = link
    newLink = newLink.trim()
    newLink = this.addProtocol(newLink)
    return newLink
  }

  /**
   * Add 'http' protocol to the links like 'example.com', 'google.com'
   * @param {String} link
   */
  private addProtocol(link: string): string {
    let newLink = link

    /**
     * If protocol already exists, do nothing
     */
    if (/^(\w+):(\/\/)?/.test(newLink)) {
      return newLink
    }

    /**
     * We need to add missed HTTP protocol to the link, but skip 2 cases:
     *     1) Internal links like "/general"
     *     2) Anchors looks like "#results"
     *     3) Protocol-relative URLs like "//google.com"
     */
    const isInternal = /^\/[^/\s]/.test(newLink)
    const isAnchor = newLink.substring(0, 1) === '#'
    const isProtocolRelative = /^\/\/[^/\s]/.test(newLink)

    if (!isInternal && !isAnchor && !isProtocolRelative) {
      newLink = `http://${newLink}`
    }

    return newLink
  }

  /**
   * Inserts <a> tag with "href", "title" and "target"
   * @param {string} link - "href" value
   */
  private insertLink(link: string): void {
    /**
     * Edit all link, not selected part
     */
    const anchorTag = this.apiSelection.findParentTag('A')

    if (anchorTag) {
      this.apiSelection.expandToTag(anchorTag)
    }

    const target = this.nodes.target.checked ? 'target="_blank"' : ''
    const title =
      this.nodes.title.value !== '' ? `title="${this.nodes.title.value}"` : ''

    document.execCommand(
      this.commandLink,
      false,
      `<a href="${link}" ${target} ${title}>${SelectionUtils.text}</a>`
    )
  }

  /**
   * Removes <a> tag
   */
  private unlink(): void {
    document.execCommand(this.commandUnlink)
  }
}
