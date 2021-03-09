/**
 * Hash tests.
 *
 * @author Matt C [matt@artemisbot.uk]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */
import TestRegister from "../../TestRegister";

TestRegister.addTests([
    {
        name: "MD2",
        input: "Hello, World!",
        expectedOutput: "1c8f1e6a94aaa7145210bf90bb52871a",
        recipeConfig: [
            {
                "op": "MD2",
                "args": []
            }
        ]
    },
    {
        name: "MD4",
        input: "Hello, World!",
        expectedOutput: "94e3cb0fa9aa7a5ee3db74b79e915989",
        recipeConfig: [
            {
                "op": "MD4",
                "args": []
            }
        ]
    },
    {
        name: "MD5",
        input: "Hello, World!",
        expectedOutput: "65a8e27d8879283831b664bd8b7f0ad4",
        recipeConfig: [
            {
                "op": "MD5",
                "args": []
            }
        ]
    },
    {
        name: "MD6",
        input: "Hello, World!",
        expectedOutput: "ce5effce32637e6b8edaacc9284b873c3fd4e66f9779a79df67eb4a82dda8230",
        recipeConfig: [
            {
                "op": "MD6",
                "args": [256, 64, ""]
            }
        ]
    },
    {
        name: "SHA0",
        input: "Hello, World!",
        expectedOutput: "5a5588f0407c6ae9a988758e76965f841b299229",
        recipeConfig: [
            {
                "op": "SHA0",
                "args": []
            }
        ]
    },
    {
        name: "SHA1",
        input: "Hello, World!",
        expectedOutput: "0a0a9f2a6772942557ab5355d76af442f8f65e01",
        recipeConfig: [
            {
                "op": "SHA1",
                "args": []
            }
        ]
    },
    {
        name: "SHA2 224",
        input: "Hello, World!",
        expectedOutput: "72a23dfa411ba6fde01dbfabf3b00a709c93ebf273dc29e2d8b261ff",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA2 384",
        input: "Hello, World!",
        expectedOutput: "5485cc9b3365b4305dfb4e8337e0a598a574f8242bf17289e0dd6c20a3cd44a089de16ab4ab308f63e44b1170eb5f515",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA2 256",
        input: "Hello, World!",
        expectedOutput: "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA2 512",
        input: "Hello, World!",
        expectedOutput: "374d794a95cdcfd8b35993185fef9ba368f160d8daf432d08ba9f1ed1e5abe6cc69291e0fa2fe0006a52570ef18c19def4e617c33ce52ef0a6e5fbe318cb0387",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["512"]
            }
        ]
    },
    {
        name: "SHA2 512/224",
        input: "Hello, World!",
        expectedOutput: "766745f058e8a0438f19de48ae56ea5f123fe738af39bca050a7547a",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["512/224"]
            }
        ]
    },
    {
        name: "SHA2 512/256",
        input: "Hello, World!",
        expectedOutput: "0686f0a605973dc1bf035d1e2b9bad1985a0bff712ddd88abd8d2593e5f99030",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["512/256"]
            }
        ]
    },
    {
        name: "SHA3 224",
        input: "Hello, World!",
        expectedOutput: "853048fb8b11462b6100385633c0cc8dcdc6e2b8e376c28102bc84f2",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA3 384",
        input: "Hello, World!",
        expectedOutput: "aa9ad8a49f31d2ddcabbb7010a1566417cff803fef50eba239558826f872e468c5743e7f026b0a8e5b2d7a1cc465cdbe",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA3 256",
        input: "Hello, World!",
        expectedOutput: "1af17a664e3fa8e419b8ba05c2a173169df76162a5a286e0c405b460d478f7ef",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA3 512",
        input: "Hello, World!",
        expectedOutput: "38e05c33d7b067127f217d8c856e554fcff09c9320b8a5979ce2ff5d95dd27ba35d1fba50c562dfd1d6cc48bc9c5baa4390894418cc942d968f97bcb659419ed",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["512"]
            }
        ]
    },
    {
        name: "Keccak 224",
        input: "Hello, World!",
        expectedOutput: "4eaaf0e7a1e400efba71130722e1cb4d59b32afb400e654afec4f8ce",
        recipeConfig: [
            {
                "op": "Keccak",
                "args": ["224"]
            }
        ]
    },
    {
        name: "Keccak 384",
        input: "Hello, World!",
        expectedOutput: "4d60892fde7f967bcabdc47c73122ae6311fa1f9be90d721da32030f7467a2e3db3f9ccb3c746483f9d2b876e39def17",
        recipeConfig: [
            {
                "op": "Keccak",
                "args": ["384"]
            }
        ]
    },
    {
        name: "Keccak 256",
        input: "Hello, World!",
        expectedOutput: "acaf3289d7b601cbd114fb36c4d29c85bbfd5e133f14cb355c3fd8d99367964f",
        recipeConfig: [
            {
                "op": "Keccak",
                "args": ["256"]
            }
        ]
    },
    {
        name: "Keccak 512",
        input: "Hello, World!",
        expectedOutput: "eda765576c84c600ed7f5d97510e92703b61f5215def2a161037fd9dd1f5b6ed4f86ce46073c0e3f34b52de0289e9c618798fff9dd4b1bfe035bdb8645fc6e37",
        recipeConfig: [
            {
                "op": "Keccak",
                "args": ["512"]
            }
        ]
    },
    {
        name: "Shake 128",
        input: "Hello, World!",
        expectedOutput: "2bf5e6dee6079fad604f573194ba8426bd4d30eb13e8ba2edae70e529b570cbd",
        recipeConfig: [
            {
                "op": "Shake",
                "args": ["128", 256]
            }
        ]
    },
    {
        name: "Shake 256",
        input: "Hello, World!",
        expectedOutput: "b3be97bfd978833a65588ceae8a34cf59e95585af62063e6b89d0789f372424e8b0d1be4f21b40ce5a83a438473271e0661854f02d431db74e6904d6c347d757",
        recipeConfig: [
            {
                "op": "Shake",
                "args": ["256", 512]
            }
        ]
    },
    {
        name: "RIPEMD 128",
        input: "Hello, World!",
        expectedOutput: "67f9fe75ca2886dc76ad00f7276bdeba",
        recipeConfig: [
            {
                "op": "RIPEMD",
                "args": ["128"]
            }
        ]
    },
    {
        name: "RIPEMD 160",
        input: "Hello, World!",
        expectedOutput: "527a6a4b9a6da75607546842e0e00105350b1aaf",
        recipeConfig: [
            {
                "op": "RIPEMD",
                "args": ["160"]
            }
        ]
    },
    {
        name: "RIPEMD 256",
        input: "Hello, World!",
        expectedOutput: "567750c6d34dcba7ae038a80016f3ca3260ec25bfdb0b68bbb8e730b00b2447d",
        recipeConfig: [
            {
                "op": "RIPEMD",
                "args": ["256"]
            }
        ]
    },
    {
        name: "RIPEMD 320",
        input: "Hello, World!",
        expectedOutput: "f9832e5bb00576fc56c2221f404eb77addeafe49843c773f0df3fc5a996d5934f3c96e94aeb80e89",
        recipeConfig: [
            {
                "op": "RIPEMD",
                "args": ["320"]
            }
        ]
    },
    {
        name: "HAS-160",
        input: "Hello, World!",
        expectedOutput: "8f6dd8d7c8a04b1cb3831adc358b1e4ac2ed5984",
        recipeConfig: [
            {
                "op": "HAS-160",
                "args": []
            }
        ]
    },
    {
        name: "Whirlpool-0",
        input: "Hello, World!",
        expectedOutput: "1c327026f565a0105a827efbfb3d3635cdb042c0aabb8416e96deb128e6c5c8684b13541cf31c26c1488949df050311c6999a12eb0e7002ad716350f5c7700ca",
        recipeConfig: [
            {
                "op": "Whirlpool",
                "args": ["Whirlpool-0"]
            }
        ]
    },
    {
        name: "Whirlpool-T",
        input: "Hello, World!",
        expectedOutput: "16c581089b6a6f356ae56e16a63a4c613eecd82a2a894b293f5ee45c37a31d09d7a8b60bfa7e414bd4a7166662cea882b5cf8c96b7d583fc610ad202591bcdb1",
        recipeConfig: [
            {
                "op": "Whirlpool",
                "args": ["Whirlpool-T"]
            }
        ]
    },
    {
        name: "Whirlpool",
        input: "Hello, World!",
        expectedOutput: "3d837c9ef7bb291bd1dcfc05d3004af2eeb8c631dd6a6c4ba35159b8889de4b1ec44076ce7a8f7bfa497e4d9dcb7c29337173f78d06791f3c3d9e00cc6017f0b",
        recipeConfig: [
            {
                "op": "Whirlpool",
                "args": ["Whirlpool"]
            }
        ]
    },
    {
        name: "Snefru 2 128",
        input: "Hello, World!",
        expectedOutput: "a4ad2b8848580511d0884fb4233a7e7a",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["2", "128"]
            }
        ]
    },
    {
        name: "Snefru 4 128",
        input: "Hello, World!",
        expectedOutput: "d154eae2c9ffbcd2e1bdaf0b84736126",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["4", "128"]
            }
        ]
    },
    {
        name: "Snefru 8 128",
        input: "Hello, World!",
        expectedOutput: "6f3d55b69557abb0a3c4e9de9d29ba5d",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["8", "128"]
            }
        ]
    },
    {
        name: "Snefru 2 256",
        input: "Hello, World!",
        expectedOutput: "65736daba648de28ef4c4a316b4684584ecf9f22ddb5c457729e6bf0f40113c4",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["2", "256"]
            }
        ]
    },
    {
        name: "Snefru 4 256",
        input: "Hello, World!",
        expectedOutput: "71b0ea4b3e33f2e58bcc67c8a8de060b99ec0107355bbfdc18d8f65f0194ffcc",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["4", "256"]
            }
        ]
    },
    {
        name: "Snefru 8 256",
        input: "Hello, World!",
        expectedOutput: "255cd401414c79588cf689e8d5ff0536a2cfab83fcae36e654f202b09bc4b8a7",
        recipeConfig: [
            {
                "op": "Snefru",
                "args": ["8", "256"]
            }
        ]
    },
    {
        name: "HMAC SHA256",
        input: "Hello, World!",
        expectedOutput: "52589bd80ccfa4acbb3f9512dfaf4f700fa5195008aae0b77a9e47dcca75beac",
        recipeConfig: [
            {
                "op": "HMAC",
                "args": ["test", "SHA256"]
            }
        ]
    },
    {
        name: "MD5: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "4f4f02e2646545aa8fc42f613c9aa068",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "MD5",
                "args": []
            }
        ]
    },
    {
        name: "SHA1: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "2c5400aaee7e8ad4cad29bfbdf8d566924e5442c",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA1",
                "args": []
            }
        ]
    },
    {
        name: "SHA2 224: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "66c166eba2529ecc44a7b7b218a64a8e3892f873c8d231e8e3c1ef3d",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA2",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA2 256: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "186ffd22c3af83995afa4a0316023f81a7f8834fd16bd2ed358c7b1b8182ba41",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA2",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA2 384: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "2a6369ffec550ea0bfb810b3b8246b7d6b7f060edfae88441f0f242b98b91549aa4ff407de38c6d03b5f377434ad2f36",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA2",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA2 512: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "544ae686522c05b70d12b460b5b39ea0a758eb4027333edbded7e2b3f467aa605804f71f54db61a7bbe50e6e7898510635efd6721fd418a9ea4d05b286d12806",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA2",
                "args": ["512"]
            }
        ]
    },
    {
        name: "SHA3 224: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "e2c07562ee8c2d73e3dd309efea257159abd0948ebc14619bab9ffb3",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA3",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA3 256: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "55a55275387586afd1ed64757c9ee7ad1d96ca81a5b7b742c40127856ee78a2d",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA3",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA3 384: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "39f8796dd697dc39e5a943817833793f2c29dc0d1adc7037854c0fb51e135c6bd26b113240c4fb1e3fcc16ff8690c91a",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA3",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA3 512: Complex bytes",
        input: "10dc10e32010de10d010dc10d810d910d010e12e",
        expectedOutput: "ee9061bed83b1ad1e2fc4a4bac72a5a65a23a0fa55193b808af0a3e2013b718a5a3e40474765b4f93d1b2747401058a5b58099cc890a159db92b2ea816287add",
        recipeConfig: [
            {
                "op": "From Hex",
                "args": ["None"]
            },
            {
                "op": "SHA3",
                "args": ["512"]
            }
        ]
    },
    {
        name: "MD5: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "2e93ee2b5b2a337ccb678c7db12eff1b",
        recipeConfig: [
            {
                "op": "MD5",
                "args": []
            }
        ]
    },
    {
        name: "SHA1: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "87f483b1515dce672be044bf183ae8103e3b2d4b",
        recipeConfig: [
            {
                "op": "SHA1",
                "args": []
            }
        ]
    },
    {
        name: "SHA2 224: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "563ca57b500157717961a5fa87ce42c6db76a488c98ea9c28d620770",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA2 256: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "36abbb4622ffff06aa3e3cea266765601b21457bb3755a0a2cf0a206422863c1",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA2 384: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "140b929391a66c9a943bcd60e6964f0d19526d3bc9ba020fbb29aae51cddb8e63a78784d8770f1d36335bf4efff8c131",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA2 512: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "04a7887c400bf647b7c67b9a0f1ada70d176348b5afdfebea184f7e62748849828669c7b5160be99455fdbf625589bd1689c003bc06ef60c39607d825a2f8838",
        recipeConfig: [
            {
                "op": "SHA2",
                "args": ["512"]
            }
        ]
    },
    {
        name: "SHA3 224: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "b3ffc9620949f879cb561fb240452494e2566cb4e4f701a85715e14f",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["224"]
            }
        ]
    },
    {
        name: "SHA3 256: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "b5f247d725b46546c832502cd07bccb5d4de0c41a6665d3944ed2cc55cd9d156",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["256"]
            }
        ]
    },
    {
        name: "SHA3 384: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "93e87b9aa8c9c47eba146adac357c525b418b71677f6db01d1c760d87b058682e639c8d43a8bfe91529cecd9800700e3",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["384"]
            }
        ]
    },
    {
        name: "SHA3 512: UTF-8",
        input: "ნუ პანიკას",
        expectedOutput: "1fbc484b5184982561795162757717474eebc846ca9f10029a75a54cdd897a7b48d1db42f2478fa1d5d213a0dd7de71c809cb19c60581ba57e7289d29408fb36",
        recipeConfig: [
            {
                "op": "SHA3",
                "args": ["512"]
            }
        ]
    },
    {
        name: "Bcrypt compare: dolphin",
        input: "dolphin",
        expectedOutput: "Match: dolphin",
        recipeConfig: [
            {
                op: "Bcrypt compare",
                args: ["$2a$10$qyon0LQCmMxpFFjwWH6Qh.dDdhqntQh./IN0RXCc3XIMILuOYZKgK"]
            }
        ]
    },
    {
        name: "Scrypt: RFC test vector 1",
        input: "",
        expectedOutput: "77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906",
        recipeConfig: [
            {
                op: "Scrypt",
                args: [
                    {
                        "option": "Latin1",
                        "string": ""
                    },
                    16, 1, 1, 64
                ]
            }
        ]
    },
    {
        name: "Scrypt: RFC test vector 2",
        input: "password",
        expectedOutput: "fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b3731622eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640",
        recipeConfig: [
            {
                op: "Scrypt",
                args: [
                    {
                        "option": "Latin1",
                        "string": "NaCl"
                    },
                    1024, 8, 16, 64
                ]
            }
        ]
    },
    {
        name: "Scrypt: RFC test vector 3",
        input: "pleaseletmein",
        expectedOutput: "7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2d5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887",
        recipeConfig: [
            {
                op: "Scrypt",
                args: [
                    {
                        "option": "Latin1",
                        "string": "SodiumChloride"
                    },
                    16384, 8, 1, 64
                ]
            }
        ]
    },
    /*{ // This takes a LONG time to run (over a minute usually).
        name: "Scrypt: RFC test vector 4",
        input: "pleaseletmein",
        expectedOutput: "2101cb9b6a511aaeaddbbe09cf70f881ec568d574a2ffd4dabe5ee9820adaa478e56fd8f4ba5d09ffa1c6d927c40f4c337304049e8a952fbcbf45c6fa77a41a4",
        recipeConfig: [
            {
                op: "Scrypt",
                args: [
                    {
                        "option": "Latin1",
                        "string": "SodiumChloride"
                    },
                    1048576, 8, 1, 64
                ]
            }
        ]
    },*/
]);
