import React, { memo } from 'react';
import { FaClipboard, FaHandPointRight, FaHandPointLeft, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { useTranslation, Trans } from 'react-i18next';

import SetCutpointButton from './components/SetCutpointButton';
import { toast } from './util';
import { primaryTextColor } from './colors';
import Sheet from './Sheet';

const electron = window.require('electron');
const { clipboard } = electron;

const { githubLink } = electron.remote.require('./constants');

const HelpSheet = memo(({ visible, onTogglePress, ffmpegCommandLog, currentCutSeg }) => {
  const { t } = useTranslation();

  return (
    <Sheet visible={visible} onClosePress={onTogglePress} style={{ background: '#6b6b6b', color: 'white' }}>
      <div className="help-sheet">
        <p><Trans><b>Note:</b> Keyframe cut and Merge cuts buttons have been moved to the export panel (press Export to see it.)</Trans></p>
        <h1>{t('Common problems')}</h1>
        <p>
          {t('Lossless cutting is not an exact science. For some codecs and files it just works. For others you may need to trial and error depending on the codec, keyframes etc to get the best cut.')}
        </p>
        <ol>
          <li>尝试 <b>关键帧剪切</b> 和 <b>普通剪切</b> 两种模式</li>
          <li>尝试把 <b>起始</b>切割点设置于最近关键帧的 <b>几帧前或几帧后</b> (也许能同时解决某些音频同步问题)</li>
          <li>尝试禁用某些 <b>轨道</b></li>
          <li>尝试不同的 <b>输出格式</b></li>
          <li>尝试开启在设置中开启 <b>实验标志</b></li>
        </ol>

        <p style={{ fontWeight: 'bold' }}>
          {t('For more help and issues, please go to:')}<br />
          <span style={{ color: primaryTextColor, cursor: 'pointer' }} role="button" onClick={() => electron.shell.openExternal(githubLink)}>{githubLink}</span>
        </p>

        <h1>{t('Keyboard & mouse shortcuts')}</h1>

        <div><kbd>H</kbd> {t('Show/hide help screen')}</div>

        <h2>{t('Playback')}</h2>

        <div><kbd>SPACE</kbd>, <kbd>k</kbd> {t('Play/pause')}</div>
        <div><kbd>J</kbd> {t('Slow down playback')}</div>
        <div><kbd>L</kbd> {t('Speed up playback')}</div>

        <h2>{t('Seeking')}</h2>

        <div><kbd>,</kbd> {t('Step backward 1 frame')}</div>
        <div><kbd>.</kbd> {t('Step forward 1 frame')}</div>
        <div><kbd>ALT</kbd> / <kbd>OPT</kbd> + <kbd>←</kbd> {t('Seek to previous keyframe')}</div>
        <div><kbd>ALT</kbd> / <kbd>OPT</kbd> + <kbd>→</kbd> {t('Seek to next keyframe')}</div>
        <div><kbd>←</kbd> {t('Seek backward 1 sec')}</div>
        <div><kbd>→</kbd> {t('Seek forward 1 sec')}</div>
        <div><kbd>CTRL</kbd> / <kbd>CMD</kbd> + <kbd>←</kbd> {t('Seek backward 1% of timeline at current zoom')}</div>
        <div><kbd>CTRL</kbd> / <kbd>CMD</kbd> + <kbd>→</kbd> {t('Seek forward 1% of timeline at current zoom')}</div>
        <div style={{ lineHeight: 1.7 }}><SetCutpointButton currentCutSeg={currentCutSeg} side="start" Icon={FaStepBackward} style={{ verticalAlign: 'middle' }} />, <kbd>SHIFT</kbd> + <kbd>←</kbd> {t('Jump to cut start')}</div>
        <div style={{ lineHeight: 1.7 }}><SetCutpointButton currentCutSeg={currentCutSeg} side="end" Icon={FaStepForward} style={{ verticalAlign: 'middle' }} />, <kbd>SHIFT</kbd> + <kbd>→</kbd> {t('Jump to cut end')}</div>

        <h2>{t('Segments and cut points')}</h2>

        <div style={{ lineHeight: 1.7 }}><SetCutpointButton currentCutSeg={currentCutSeg} side="start" Icon={FaHandPointLeft} style={{ verticalAlign: 'middle' }} />, <kbd>I</kbd> {t('Mark in / cut start point for current segment')}</div>
        <div style={{ lineHeight: 1.7 }}><SetCutpointButton currentCutSeg={currentCutSeg} side="end" Icon={FaHandPointRight} style={{ verticalAlign: 'middle' }} />, <kbd>O</kbd> {t('Mark out / cut end point for current segment')}</div>
        <div><kbd>+</kbd> {t('Add cut segment')}</div>
        <div><kbd>BACKSPACE</kbd> {t('Remove current segment')}</div>
        <div><kbd>↑</kbd> {t('Select previous segment')}</div>
        <div><kbd>↓</kbd> {t('Select next segment')}</div>
        <div><kbd>B</kbd> {t('Split segment at cursor')}</div>

        <h2>{t('Timeline/zoom operations')}</h2>
        <div><kbd>Z</kbd> {t('Toggle zoom between 1x and a calculated comfortable zoom level')}</div>
        <div><kbd>CTRL</kbd> / <kbd>CMD</kbd> + <kbd>↑</kbd> {t('Zoom in timeline')}</div>
        <div><kbd>CTRL</kbd> / <kbd>CMD</kbd> + <kbd>↓</kbd> {t('Zoom out timeline')}</div>
        <div><kbd>CTRL</kbd> <i>+ {t('Mouse scroll/wheel up/down')}</i> - {t('Zoom in/out timeline')}</div>
        <div><i>{t('Mouse scroll/wheel left/right')}</i> - {t('Pan timeline')}</div>

        <h2>{t('Other operations')}</h2>
        <div><kbd>R</kbd> {t('Change rotation')}</div>

        <h2>{t('Output actions')}</h2>
        <div><kbd>E</kbd> {t('Export segment(s)')}</div>
        <div><kbd>C</kbd> {t('Capture snapshot')}</div>
        <div><kbd>D</kbd> {t('Delete source file')}</div>

        <p style={{ fontWeight: 'bold' }}>{t('Hover mouse over buttons in the main interface to see which function they have')}</p>

        <h1>剪切模式说明</h1>
        <p>
          <b>关键帧</b>即时间轴中位于<b>黑色竖线</b>的视频帧。<br /><br />
          若选择<b>关键帧剪切</b>，则每个片段实际输出的起始位置<b>不是时间轴上片段框的起始位置</b>，而是把片段框的前一个关键帧作为起始位置。片段的结束位置不受影响，仍然是准确的。（<b>注意</b>：当把起始位置设在关键帧处时，软件可能不会把当前关键帧而是前一个关键帧作为起始位置）<br /><br />
          若选择<b>普通剪切</b>，则每个片段的起始与结束位置是<b>准确</b>的，但是由于开头缺少关键帧，片段的开头到下一个关键帧将保留空白画面，通常显示为开头画面被定格到下一个关键帧。片段的结尾部分不受影响，仍然是正常的画面。<br /><br />
          一般推荐使用<b>关键帧剪切</b>。一般视频
        </p>

        <h1 style={{ marginTop: 40 }}>{t('Last ffmpeg commands')}</h1>
        {ffmpegCommandLog.length > 0 ? (
          <div style={{ overflowY: 'scroll', height: 200 }}>
            {ffmpegCommandLog.reverse().map(({ command }, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} style={{ whiteSpace: 'pre', margin: '5px 0' }}>
                <FaClipboard style={{ cursor: 'pointer' }} title={t('Copy to clipboard')} onClick={() => { clipboard.writeText(command); toast.fire({ timer: 2000, icon: 'success', title: t('Copied to clipboard') }); }} /> {command}
              </div>
            ))}
          </div>
        ) : (
          <p>{t('The last executed ffmpeg commands will show up here after you run operations. You can copy them to clipboard and modify them to your needs before running on your command line.')}</p>
        )}
      </div>
    </Sheet>
  );
});

export default HelpSheet;
