import { Form, Input } from 'antd';

const CharacterConstraintEditor: React.FC = () => {
  return (
    <>
      <Form.Item
        extra='输入 JSON 数组，例如 ["黑色短发","校服","干净构图"]'
        label="正向约束"
        name="positive_constraints"
      >
        <Input.TextArea placeholder='["黑色短发","校服","干净构图"]' rows={3} />
      </Form.Item>
      <Form.Item
        extra='输入 JSON 数组，例如 ["多余手指","面部崩坏"]'
        label="负向约束"
        name="negative_constraints"
      >
        <Input.TextArea placeholder='["多余手指","面部崩坏"]' rows={3} />
      </Form.Item>
    </>
  );
};

export default CharacterConstraintEditor;
