import { StylePreset, AspectRatio } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'realistic',
    name: 'Realistic Film Look',
    description: 'Chân thực, điện ảnh, chi tiết da tự nhiên',
    promptValue: 'Realistic film look, cinematic lighting, 35mm lens, natural skin texture'
  },
  {
    id: 'neonoir',
    name: 'Neo-noir Rainy',
    description: 'Đêm mưa, ánh đèn neon, tương phản cao',
    promptValue: 'Neo-noir rainy night, wet streets, high contrast, neon reflections, moody atmosphere'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Gritty',
    description: 'Tương lai, dơ hề, đèn LED, kim loại',
    promptValue: 'Cyberpunk gritty, futuristic urban decay, neon holographic signs, techwear aesthetics'
  },
  {
    id: 'vintage',
    name: 'Vintage 1970s',
    description: 'Màu phim cũ, hạt nhiễu nhẹ, hoài cổ',
    promptValue: 'Vintage 1970s cinema, retro aesthetics, warm color grading, film grain'
  },
  {
    id: 'street',
    name: 'Street Fashion',
    description: 'Hiện đại, thời trang đường phố, sắc nét',
    promptValue: 'Street fashion contemporary, urban backdrop, natural daylight, sharp focus, hypebeast style'
  },
  {
    id: 'fantasy',
    name: 'Medieval Fantasy',
    description: 'Thần thoại, thực tế (không hoạt hình)',
    promptValue: 'Medieval fantasy grounded, authentic textures, leather and steel, atmospheric lighting'
  },
  {
    id: 'ghibli',
    name: 'Ghibli Soft (Realistic)',
    description: 'Mềm mại kiểu Ghibli nhưng giữ mặt người thật',
    promptValue: 'Ghibli-inspired soft lighting, lush colors, realistic faces, dreamy atmosphere, pictorial style'
  },
  {
    id: 'editorial',
    name: 'High-fashion Editorial',
    description: 'Ánh sáng studio, tạo dáng thời trang',
    promptValue: 'High-fashion editorial, studio lighting, avant-garde composition, magazine quality'
  },
  {
    id: 'action',
    name: 'Action Thriller',
    description: 'Cầm tay rung nhẹ, kịch tính, dynamic',
    promptValue: 'Action thriller, handheld camera movement, dynamic angles, gritty realism'
  },
  {
    id: 'commercial',
    name: 'Clean Commercial',
    description: 'Sáng sủa, sạch sẽ, quảng cáo ban ngày',
    promptValue: 'Clean commercial daylight, soft shadows, high key lighting, crisp details, approachable'
  }
];

export const DEFAULT_SCRIPT_PLACEHOLDER = `1. Nhân vật bước qua con hẻm neon dưới mưa bay, liếc nhìn camera, sau đó lao vụt sang trái.
2. Cảnh cận mặt nhân vật thở dốc, nhìn hoảng sợ về phía sau.
3. _
`;

export const IDENTITY_ANCHOR_TEMPLATE = `
IDENTITY ANCHOR RULE:
- Must describe nationality/ethnicity clearly.
- Face shape (oval, round, heart...)
- Eyes: color, shape (almond, round...), eyelid type (single/double), iris size
- Eyebrows: shape, thickness, spacing
- Nose: bridge height, shape (straight, gentle curve...)
- Lips: thickness, cupid’s bow, upper/lower ratio
- Jawline & chin: V-shape, rounded, sharp, soft taper...
- Hair: color range, length, parting, style, bangs (yes/no)
- Skin: tone, texture
- NO scars/moles unless requested.
`;
