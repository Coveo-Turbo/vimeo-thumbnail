import { ModalBox as ModalBoxModule, Component, IComponentBindings, ComponentOptions, Dom, AccessibleModal, IQueryResult, $$, ResultLink, Utils, SVGIcons, SVGDom, Initialization } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IVimeoThumbnailOptions {
  width: string;
  height: string;
  embed: boolean;
  fieldThumbnail: string;
  fieldVideoId: string;
}

@lazyComponent
export class VimeoThumbnail extends Component {
    static ID = 'VimeoThumbnail';
    static options: IVimeoThumbnailOptions = {
      width: ComponentOptions.buildStringOption({ defaultValue: '200px' }),
      height: ComponentOptions.buildStringOption({ defaultValue: '112px' }),
      embed: ComponentOptions.buildBooleanOption({ defaultValue: true }),
      fieldThumbnail: ComponentOptions.buildStringOption({ defaultValue: 'ytthumbnailurl' }),
      fieldVideoId: ComponentOptions.buildStringOption({ defaultValue: 'uri' }),
    };

    public resultLink: Dom;

    private modalbox: AccessibleModal;

    constructor(public element: HTMLElement, public options: IVimeoThumbnailOptions, public bindings: IComponentBindings,
      public result?: IQueryResult,
    ModalBox = ModalBoxModule,
    private origin?: HTMLElement) {
        super(element, VimeoThumbnail.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, VimeoThumbnail, options);

    this.resultLink = $$('a', {
      className: Component.computeCssClassName(ResultLink)
    });

    if (!origin) {
      this.origin = this.resultLink.el;
    }

    const thumbnailDiv = $$('div', {
      className: 'coveo-youtube-thumbnail-container'
    });

    this.resultLink.append(thumbnailDiv.el);

    const img = $$('img', {
      src: Utils.getFieldValue(this.result, this.options.fieldThumbnail),
      className: 'coveo-youtube-thumbnail-img',
      alt: this.result.title,
      title: this.result.title
    });

    img.el.style.width = this.options.width;
    img.el.style.height = this.options.height;
    img.el.onerror = () => {
      const svgVideo = $$('div', {}, SVGIcons.icons.video).el;
      SVGDom.addStyleToSVGInContainer(svgVideo, {
        width: this.options.width
      });
      $$(img).remove();
      thumbnailDiv.append(svgVideo);
    };
    thumbnailDiv.append(img.el);

    const span = $$('span', {
      className: 'coveo-youtube-thumbnail-play-button'
    });

    thumbnailDiv.append(span.el);

    $$(this.element).append(this.resultLink.el);

    Initialization.automaticallyCreateComponentsInsideResult(element, result, {
      ResultLink: this.options.embed ? { onClick: () => this.openVimeoIframe() } : null
    });
    //@ts-ignore
    this.modalbox = new AccessibleModal('coveo-youtube-player', this.searchInterface.options.modalContainer, ModalBox, {
      overlayClose: true
    });
  }

  

  private openVimeoIframe() {
    // need to put iframe inside div : iframe with position absolute and left:0, right : 0 , bottom: 0 is not standard/supported
    /* <iframe src="https://player.vimeo.com/video/449242504?color=ffffff&badge=0" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
<p><a href="https://vimeo.com/449242504">SCARLET MEDUSA</a> from <a href="https://vimeo.com/spencermacdonald">Spencer MacDonald</a> on <a href="https://vimeo.com">Vimeo</a>.</p>
*/ 
    const iframe = $$('iframe', {
      src: `https://player.vimeo.com/video/${this.extractVideoId()}?autoplay=1`,
      allowfullscreen: 'allowfullscreen',
      width: '100%',
      height: '100%',
      title: this.result.title
    });

    const div = $$('div');

    div.append(iframe.el);

    this.modalbox.openResult({
      result: this.result,
      options: { showDate: true, title: this.result.title },
      bindings: this.bindings,
      content: div.el,
      validation: () => true,
      origin: this.origin
    });

    $$($$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', () => {
      this.modalbox.close();
    });
  }

  public extractVideoId() {
    let field = Utils.getFieldValue(this.result, this.options.fieldVideoId);
    return field.split('/')[3];
  }
}

