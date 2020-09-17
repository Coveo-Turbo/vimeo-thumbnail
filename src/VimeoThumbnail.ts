import { ModalBox as ModalBoxModule, Component, IComponentBindings, ComponentOptions, Dom, AccessibleModal, IQueryResult, $$, ResultLink, Utils, SVGDom, Initialization, ModalBox, IStringMap } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';
import { SVGIcons } from './SVGIcons';
import { each } from 'underscore';

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

  private modalbox: ModalBox.ModalBox;

  constructor(public element: HTMLElement, public options: IVimeoThumbnailOptions, public bindings: IComponentBindings,
    public result?: IQueryResult,
    private ModalBox = ModalBoxModule,
    private origin?: HTMLElement) {
    super(element, VimeoThumbnail.ID, bindings);
    this.options = ComponentOptions.initComponentOptions(element, VimeoThumbnail, options);
    let _this = this;
    this.loadComponents().then( function () {

    _this.resultLink = $$('a', {
      className: 'CoveoResultLink'//ResultLink.computeCssClassName(ResultLink)//Component.computeCssClassName(ResultLink)
    });

    if (!origin) {
      _this.origin = _this.resultLink.el;
    }

    const thumbnailDiv = $$('div', {
      className: 'coveo-youtube-thumbnail-container'
    });

    _this.resultLink.append(thumbnailDiv.el);

    const img = $$('img', {
      src: Utils.getFieldValue(_this.result, _this.options.fieldThumbnail),
      className: 'coveo-youtube-thumbnail-img',
      alt: _this.result.title,
      title: _this.result.title
    });

    img.el.style.width = _this.options.width;
    img.el.style.height = _this.options.height;
    img.el.onerror = () => {
      const svgVideo = $$('div', {}, SVGIcons.icons.video).el;
      _this.addStyle(svgVideo, {
        width: _this.options.width
      });
      $$(img).remove();
      thumbnailDiv.append(svgVideo);
    };
    thumbnailDiv.append(img.el);

    const span = $$('span', {
      className: 'coveo-youtube-thumbnail-play-button'
    });

    thumbnailDiv.append(span.el);

    $$(_this.element).append(_this.resultLink.el);

    Initialization.automaticallyCreateComponentsInsideResult(element, result, {
      ResultLink: _this.options.embed ? { onClick: () => _this.openVimeoIframe() } : null
    });
    
    
  });

  }

  private addStyle(svgContainer: HTMLElement, styleToAdd: IStringMap<any>){
    const svgElement = svgContainer.querySelector('svg');
    each(styleToAdd, (styleValue, styleKey) => {
      svgElement.style[styleKey] = styleValue;
    });
  }
  private loadComponents(){
    return new Promise(function (deferred) {
        Coveo.load('ResultLink').then(ResultLink => {
          deferred();
        });
      
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

    this.modalbox = this.ModalBox.open(iframe.el, {
      sizeMod: 'big',
      title: this.result.title,
      className: 'coveo-youtube-player'
    });
    

    /*$$($$(this.modalbox.wrapper).find('.coveo-quickview-close-button')).on('click', () => {
      this.modalbox.close();
    });*/
  }

  public extractVideoId() {
    let field = Utils.getFieldValue(this.result, this.options.fieldVideoId);
    //field = "https://vimeo.com/443369900";
    return field.split('/')[3];
    
  }
}
Initialization.registerComponentFields('VimeoThumbnail', ['ytthumbnailurl']);

