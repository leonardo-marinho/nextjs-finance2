import { JwtConfig } from '@/lib/shared/config/Jwt.config';
import { NodeConfig } from '@/lib/shared/config/Node.config';

class Config {
  jwt: JwtConfig = new JwtConfig();
  node: NodeConfig = new NodeConfig();
}

export const config = new Config();
