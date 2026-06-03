export interface ApiEnvelope<T> {
  code?: number;
  data?: T;
  detail?: string;
  errorMessage?: string;
  message?: string;
  success?: boolean;
}

export interface AssetSummary {
  character_image_count?: number;
  persona_doc_count?: number;
  script_file_count?: number;
  style_reference_count?: number;
}

export interface TaskSummary {
  error_code?: string | null;
  error_message?: string;
  log_file_path?: string | null;
  retry_count?: number;
  stage?: string;
  status?: string;
  task_id?: number | string;
}

export interface Project {
  asset_summary?: AssetSummary;
  created_at?: string;
  description?: string;
  final_video?: Record<string, any> | null;
  latest_task?: TaskSummary;
  name?: string;
  project_id?: number | string;
  status?: string;
  style_preset?: string;
  target_duration_sec?: number;
  updated_at?: string;
}

export interface ProjectListItem {
  created_at?: string;
  description?: string | null;
  name?: string;
  project_id?: number | string;
  status?: string;
  style_preset?: string | null;
  target_duration_sec?: number;
  updated_at?: string;
}

export interface ProjectListResponse {
  items: ProjectListItem[];
  page: number;
  page_size: number;
  total: number;
}

export interface ProjectStatus {
  current_stage?: string;
  last_error_code?: string;
  last_error_message?: string;
  progress?: number | null;
  project_id?: number | string;
  retry_count?: number;
  status?: string;
  updated_at?: string;
}

export interface ParseScriptResult {
  log_file_path?: string | null;
  project_id?: number | string;
  status?: string;
  shot_count?: number;
  task_id?: number | string;
  workflow_status?: string;
}

export interface CreateProjectPayload {
  description?: string;
  name: string;
  style_preset?: string;
  target_duration_sec?: number;
}

export type JsonLike =
  | Record<string, any>
  | any[]
  | string
  | number
  | boolean
  | null;

export interface CharacterProfile {
  character_id?: number | string;
  created_at?: string;
  name?: string;
  persona_text?: string;
  project_id?: number | string;
  prompt_constraints?: JsonLike;
  reference_image_asset_ids?: Array<number | string>;
  reference_image_count?: number;
  reference_image_paths?: string[];
  seed_policy?: JsonLike;
  voice_style?: string;
}

export interface CreateCharacterPayload {
  name: string;
  persona_text: string;
  prompt_constraints?: JsonLike;
  reference_image_asset_ids?: Array<number | string>;
  seed_policy?: JsonLike;
  voice_style?: string;
}

export interface VisualAsset {
  asset_id?: number | string;
  asset_type?: string;
  file_path?: string;
  is_selected?: boolean;
  project_id?: number | string;
  prompt_used?: string;
  provider?: string;
  resolution?: string;
  seed?: number | null;
  shot_id?: number | string;
}

export interface GenerateVisualAssetPayload {
  override_prompt?: string;
  provider: string;
  resolution: string;
}

export interface TaskLog {
  error_code?: string;
  error_message?: string;
  log_content?: string;
  log_file_path?: string;
  project_id?: number | string;
  retry_count?: number;
  stage?: string;
  status?: string;
  task_id?: number | string;
}

export interface UploadedAsset {
  asset_id?: number | string;
  asset_type?: string;
  file_path?: string;
}

export interface UploadProjectAssetsResult {
  failed?: UploadedAsset[];
  project_id?: number | string;
  uploaded?: UploadedAsset[];
}

export interface CharacterListResult {
  items: CharacterProfile[];
  project_id?: number | string;
}

export interface VisualAssetListResult {
  items: VisualAsset[];
  project_id?: number | string;
  shot_id?: number | string;
}
