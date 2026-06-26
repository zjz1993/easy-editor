// import type { CustomLinkAttrs } from '@/Editor/textarea/views/link';
// import { Button, Form, Input, Space } from 'antd';
import type {FC} from 'react';

const LinkEditPopover: FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = props => {
  // const { onCancel, text, href, onSubmit } = props;
  // const [form] = Form.useForm();
  //const onFinished = async () => {
  //  const data = await form.validateFields();
  //  onSubmit(data);
  //};
  return (
    <div className="link_editor">
      <div>123</div>
      {/*<Form form={form} layout="vertical" initialValues={{ text, href }}>*/}
      {/*  <Form.Item label="文字" name="text" help="不填写时锚文本的文字就是链接">*/}
      {/*    <Input />*/}
      {/*  </Form.Item>*/}
      {/*  <Form.Item*/}
      {/*    label="链接"*/}
      {/*    name="href"*/}
      {/*    rules={[{ required: true, message: '请填写链接' }]}*/}
      {/*  >*/}
      {/*    <Input />*/}
      {/*  </Form.Item>*/}
      {/*</Form>*/}
      {/*<Space className="btn_wrapper">*/}
      {/*  <Button type="primary" onClick={onFinished}>*/}
      {/*    确定*/}
      {/*  </Button>*/}
      {/*  <Button onClick={onCancel}>取消</Button>*/}
      {/*</Space>*/}
    </div>
  );
};
export default LinkEditPopover;
