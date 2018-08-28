/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Implements the CHTMLmsubsup wrapper for the MmlMsubsup object
 *                and the special cases CHTMLmsub and CHTMLmsup
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CHTMLscriptbase} from './scriptbase.js';
import {CommonMsub, CommonMsubInterface} from '../../common/Wrappers/msubsup.js';
import {CommonMsup, CommonMsupInterface} from '../../common/Wrappers/msubsup.js';
import {CommonMsubsup, CommonMsubsupInterface} from '../../common/Wrappers/msubsup.js';
import {MmlMsubsup, MmlMsub, MmlMsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {StyleList} from '../../common/CssStyles.js';

/*****************************************************************/
/**
 * The CHTMLmsub wrapper for the MmlMsub object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsub<N, T, D> extends
CommonMsub<CHTMLWrapper<N, T, D>, Constructor<CHTMLscriptbase<N, T, D>>>(CHTMLscriptbase)  {

    public static kind = MmlMsub.prototype.kind;

    public static useIC = false;

}

/*****************************************************************/
/**
 * The CHTMLmsup wrapper for the MmlMsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsup<N, T, D> extends
CommonMsup<CHTMLWrapper<N, T, D>, Constructor<CHTMLscriptbase<N, T, D>>>(CHTMLscriptbase)  {

    public static kind = MmlMsup.prototype.kind;

    public static useIC: boolean = true;

}

/*****************************************************************/
/**
 * The CHTMLmsubsup wrapper for the MmlMsubsup object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class CHTMLmsubsup<N, T, D> extends
CommonMsubsup<CHTMLWrapper<N, T, D>, Constructor<CHTMLscriptbase<N, T, D>>>(CHTMLscriptbase)  {

    public static kind = MmlMsubsup.prototype.kind;

    public static styles: StyleList = {
        'mjx-script': {
            display: 'inline-block',
            'padding-right': '.05em'   // scriptspace
        },
        'mjx-script > *': {
            display: 'block'
        }
    };

    public static noIC: boolean = true;

    /**
     * @override
     */
    public toCHTML(parent: N) {
        const chtml = this.standardCHTMLnode(parent);
        const [u, v, q] = this.getUVQ(this.baseChild.getBBox(), this.subChild.getBBox(), this.supChild.getBBox());
        const style = {'vertical-align': this.em(v)};
        this.baseChild.toCHTML(chtml);
        const stack = this.adaptor.append(chtml, this.html('mjx-script', {style})) as N;
        this.supChild.toCHTML(stack);
        this.adaptor.append(stack, this.html('mjx-spacer', {style: {'margin-top': this.em(q)}}));
        this.subChild.toCHTML(stack);
        const corebox = this.baseCore.bbox;
        if (corebox.ic) {
            this.adaptor.setStyle(this.supChild.chtml, 'marginLeft',
                                 this.em((1.2 * corebox.ic + .05) / this.supChild.bbox.rscale));
        }
    }

}
