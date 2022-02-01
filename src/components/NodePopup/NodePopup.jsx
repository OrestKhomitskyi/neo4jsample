import React, { useMemo } from "react";
import { Drawer, List } from "antd";
import { useEffect, useState } from "react/cjs/react.development";
import _ from "lodash";
import Title from "antd/lib/typography/Title";

export const NodePopup = ({ data: rawData }) => {
  const [visible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!!rawData) {
      setIsVisible(true);
    }
  }, [rawData]);
  const data = useMemo(() => {
    if (!rawData) return;
    return {
      id: rawData.id.toString(),
      type: rawData.type,
      infoType: rawData.infoType,
      ...rawData.properties,
    };
  }, [rawData]);

  return (
    <Drawer visible={visible} onClose={() => setIsVisible(false)}>
      {data && (
        <div>
          <Title level={5}>{data.infoType}</Title>
          <List
            dataSource={_.chain(data).omit("infoType").entries().value()}
            itemLayout="horizontal"
            renderItem={([key, value]) => (
              <List.Item>
                <List.Item.Meta
                  title={key.toUpperCase()}
                  description={value}
                ></List.Item.Meta>
              </List.Item>
            )}
          />
        </div>
      )}
    </Drawer>
  );
};
